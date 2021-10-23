import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import client, { q } from "../../../fauna_client";
import getOrgByUserId from "../../../utils/get_org_by_user_id";

const getOrg = async (req, res) => {
    try {
        const { user } = getSession(req, res);

        const { data: orgs } = await getOrgByUserId(user.sub);
        const [orgRef] = orgs;

        const { data: org } = await client.query(q.Get(orgRef));
        res.json({ ...org });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

export default withApiAuthRequired(getOrg);
