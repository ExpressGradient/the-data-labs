import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Nav from "../../components/global/Nav";
import {
    DashboardAlert,
    DashboardCreateOrgForm,
    LabSearchBar,
    LabsUnderOrg,
} from "../../components/dashboard/index";
import useSWR from "swr";
import { Box, Divider, Stack } from "@chakra-ui/react";
import supabase from "../../supabase_client";

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
            <Nav
                title={data.name}
                description={data.description}
                picture={payload.picture}
            />
            <Box as="main" mx={["4", "auto"]} w={["100%", 2 / 3]}>
                <Stack>
                    <LabSearchBar />
                    <Divider />
                    <LabsUnderOrg ssrLabs={payload.labs} />
                </Stack>
            </Box>
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

        const { data: orgs } = await supabase
            .from("orgs")
            .select()
            .eq("owner_id", user.sub);

        if (orgs.length === 0) {
            return {
                props: {
                    state: "USER_NO_ORG",
                    payload: { picture: user.picture },
                },
            };
        }

        const { data: labs } = await supabase
            .from("labs")
            .select("*")
            .eq("org", orgs[0].id);

        return {
            props: {
                state: "USER_HAS_ORG",
                payload: { ...orgs[0], picture: user.picture, labs },
            },
        };
    },
});

export default Dashboard;
