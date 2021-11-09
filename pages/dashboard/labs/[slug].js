import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../supabase_client";

const LabView = () => <></>;

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
                payload: labs[0],
            },
        };
    },
});

export default LabView;
