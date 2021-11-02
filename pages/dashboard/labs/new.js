import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Nav from "../../../components/global/Nav";
import getOrgByUserId from "../../../utils/get_org_by_user_id";
import { CreateLabForm } from "../../../components/dashboard/labs/new";

const New = ({ payload }) => (
    <>
        <Nav title="Create a New Lab" picture={payload.picture} />
        <CreateLabForm />
    </>
);

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps({ req }) {
        const { user } = getSession(req);
        const { data: orgs } = await getOrgByUserId(user.sub);

        if (orgs.length === 0) {
            return {
                redirect: {
                    destination: "/dashboard",
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

export default New;
