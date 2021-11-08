import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../supabase_client";

const getAll = async (req, res) => {
    const { user } = getSession(req);

    const { data: orgs } = await supabase
        .from("orgs")
        .select("id")
        .eq("owner_id", user.sub);

    const orgId = orgs[0].id;

    const { data } = await supabase.from("labs").select("*").eq("org", orgId);

    res.json(data);
};

export default withApiAuthRequired(getAll);
