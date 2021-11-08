import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../supabase_client";

const checkUniqueLabName = async (req, res) => {
    const { slug } = req.query;

    const { data } = await supabase.from("labs").select("*").eq("slug", slug);

    res.json({ isUnique: data.length === 0 });
};

export default withApiAuthRequired(checkUniqueLabName);
