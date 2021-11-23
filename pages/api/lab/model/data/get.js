import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../../../supabase_client";

const get = async (req, res) => {
    const { modelSlug } = req.query;

    const { data: model } = await supabase
        .from("models")
        .select("id")
        .eq("slug", modelSlug)
        .single();

    const { data } = await supabase
        .from("model_data")
        .select("data")
        .eq("model", model.id);

    res.json({ data });
};

export default withApiAuthRequired(get);
