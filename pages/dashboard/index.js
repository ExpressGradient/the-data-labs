import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Nav from "../../components/global/Nav";
import getOrgByUserId from "../../utils/get_org_by_user_id";
import {
    DashboardAlert,
    DashboardCreateOrgForm,
} from "../../components/dashboard_index";

const Dashboard = (props) => {
    if (props.state === "EMAIL_NOT_VERIFIED") {
        return <DashboardAlert />;
    }

    if (props.state === "USER_NO_ORG") {
        return (
            <>
                <Nav picture={props.payload.picture} />
                <DashboardCreateOrgForm />
            </>
        );
    }

    return <h1>Hello</h1>;
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

        return {
            props: {},
        };
    },
});

export default Dashboard;
