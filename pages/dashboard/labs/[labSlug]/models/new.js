import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../../../supabase_client";
import Nav from "../../../../../components/global/Nav";
import { Box } from "@chakra-ui/react";
import { CreateModelForm } from "../../../../../components/dashboard/labs/[labSlug]/models/new";

const NewModel = ({ payload }) => {
    return (
        <>
            <Nav title="Create a Model" picture={payload.picture} />
            <Box as="main" w={["full", 1 / 3]} mx={[4, "auto"]}>
                <CreateModelForm />
            </Box>
        </>
    );
};

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps({ req, params, res }) {
        const { user } = getSession(req, res);

        const { data: orgs } = await supabase
            .from("orgs")
            .select("id")
            .eq("owner_id", user.sub);
        const orgId = orgs[0].id;

        const { data: labs } = await supabase
            .from("labs")
            .select("*")
            .eq("org", orgId)
            .eq("slug", params.labSlug);

        if (labs.length === 0) {
            return {
                redirect: {
                    destination: "/404",
                    permanent: false,
                },
            };
        }

        return {
            props: {
                payload: {
                    picture: user.picture,
                },
            },
        };
    },
});

export default NewModel;
