import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Nav from "../../components/global/Nav";
import getOrgByUserId from "../../utils/get_org_by_user_id";
import {
    DashboardAlert,
    DashboardCreateOrgForm,
    DashboardMain,
} from "../../components/dashboard/index";
import client, { q } from "../../fauna_client";
import useSWR from "swr";
import { Heading } from "@chakra-ui/react";

const fetcher = (url) => fetch(url).then((r) => r.json());

const Dashboard = ({ state, payload }) => {
    const { data } = useSWR(
        state === "USER_HAS_ORG" ? "/api/org/get" : null,
        fetcher,
        { fallbackData: payload }
    );

    if (state === "EMAIL_NOT_VERIFIED") {
        return <DashboardAlert />;
    }

    if (state === "USER_NO_ORG") {
        return (
            <>
                <Nav picture={payload.picture} />
                <DashboardCreateOrgForm />
            </>
        );
    }

    return (
        <>
            <Nav title={data.name} picture={payload.picture} />
            <DashboardMain />
        </>
    );
};

// Returns {state, payload}
export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps({ req }) {
        const { user } = getSession(req);

        if (!user.email_verified) {
            return { props: { state: "EMAIL_NOT_VERIFIED" } };
        }

        const { data: orgs } = await getOrgByUserId(user.sub);

        if (orgs.length === 0) {
            return {
                props: {
                    state: "USER_NO_ORG",
                    payload: { picture: user.picture },
                },
            };
        }

        const [orgRef] = orgs;
        const { data: org } = await client.query(q.Get(orgRef));

        return {
            props: {
                state: "USER_HAS_ORG",
                payload: { ...org, picture: user.picture },
            },
        };
    },
});

export default Dashboard;
