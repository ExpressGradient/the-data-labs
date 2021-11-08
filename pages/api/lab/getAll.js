import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../supabase_client";

const getAll = async (req, res) => {
    const { user } = getSession(req);

    const { data: orgs } = await supabase
        .from("orgs")
        .select("id")
        .eq("owner_id", user.sub);

    const orgId = orgs[0].id;

    const { data: labs } = await supabase
        .from("labs")
        .select("name, description")
        .eq("org", orgId);

    res.json({ ...labs });
};

export default withApiAuthRequired(getAll);
