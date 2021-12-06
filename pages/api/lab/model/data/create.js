import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import Ajv from "ajv";
import { nanoid } from "nanoid";
import supabase from "../../../../../supabase_client";

const create = async (req, res) => {
    const { modelSlug } = req.query;

    const { data: model } = await supabase
        .from("models")
        .select("id, schema")
        .eq("slug", modelSlug)
        .single();

    const ajv = new Ajv();
    const validate = ajv.compile(model.schema);

    const record = {
        id: nanoid(),
        ...req.body,
    };

    const isValid = validate(record);

    if (!isValid) {
        res.status(500).json({
            error: validate.errors,
        });
    } else {
        await supabase
            .from("model_data")
            .insert([{ model: model.id, data: record }]);

        res.json({ message: "success" });
    }
};

export default withApiAuthRequired(create);
