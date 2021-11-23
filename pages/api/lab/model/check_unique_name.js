import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../../supabase_client";

const checkUniqueNameSlug = async (req, res) => {
    const { labSlug, modelSlug } = req.body;

    const { data: lab } = await supabase
        .from("labs")
        .select("id")
        .eq("slug", labSlug)
        .single();

    const { data } = await supabase
        .from("models")
        .select("id")
        .eq("lab", lab.id)
        .eq("slug", modelSlug)
        .single();

    res.json({ isUnique: data === null });
};

export default withApiAuthRequired(checkUniqueNameSlug);
