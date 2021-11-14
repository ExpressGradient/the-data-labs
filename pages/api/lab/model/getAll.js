import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../../supabase_client";

const getAll = async (req, res) => {
    const { labSlug } = req.query;

    const { data: lab } = await supabase
        .from("labs")
        .select("id")
        .eq("slug", labSlug)
        .single();

    const { data: models } = await supabase
        .from("models")
        .select("*")
        .eq("lab", lab.id);

    res.json({ ...models });
};

export default withApiAuthRequired(getAll);
