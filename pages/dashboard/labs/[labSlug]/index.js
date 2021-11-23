import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../../supabase_client";
import Nav from "../../../../components/global/Nav";
import Head from "next/head";
import { Stack, Divider, Heading } from "@chakra-ui/react";
import { ModelGrid } from "../../../../components/dashboard/labs/[labSlug]";

const LabView = ({ payload }) => {
    return (
        <>
            <Head>
                <title>The Data Labs - {payload.lab.name}</title>
                <meta name="description" content={payload.lab.description} />
            </Head>
            <Nav
                title={payload.lab.name}
                description={payload.lab.description}
                picture={payload.picture}
            />
            <Stack
                as="main"
                w={["full", 2 / 3]}
                mx={[4, "auto"]}
                direction="column"
            >
                <Divider />
                <Heading size="lg">Your Models</Heading>
                <ModelGrid models={payload.models} />
            </Stack>
        </>
    );
};

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps({ req, params }) {
        const { user } = getSession(req);

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

        const { data: models } = await supabase
            .from("models")
            .select("*")
            .eq("lab", labs[0].id);

        return {
            props: {
                payload: { picture: user.picture, lab: labs[0], models },
            },
        };
    },
});

export default LabView;
