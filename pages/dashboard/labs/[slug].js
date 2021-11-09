import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../supabase_client";
import Nav from "../../../components/global/Nav";
import Head from "next/head";

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
            .eq("slug", params.slug);

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
                payload: { picture: user.picture, lab: labs[0] },
            },
        };
    },
});

export default LabView;
