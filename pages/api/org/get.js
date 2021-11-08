import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../supabase_client";

const getOrg = async (req, res) => {
    try {
        const { user } = getSession(req, res);

        const { data: orgs } = await supabase
            .from("orgs")
            .select("*")
            .eq("owner_id", user.sub);

        res.json({ ...orgs[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

export default withApiAuthRequired(getOrg);
