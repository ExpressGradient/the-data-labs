import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { nanoid } from "nanoid";
import supabase from "../../../../supabase_client";

const createModel = async (req, res) => {
    try {
        const {
            modelName: name,
            modelDescription: description,
            modelSlug: slug,
            modelFields,
            labSlug,
        } = req.body;

        const { data: lab } = await supabase
            .from("labs")
            .select("id")
            .eq("slug", labSlug)
            .single();

        const properties = {};
        const required = [];

        modelFields.forEach(({ name, type }) => {
            properties[name] = { type };
            required.push(name);
        });

        const schema = {
            type: "object",
            properties,
            required,
            additionalProperties: false,
        };

        await supabase.from("models").insert([
            {
                name,
                description,
                slug,
                lab: lab.id,
                schema: JSON.stringify(schema),
                key: nanoid(),
            },
        ]);

        res.json({ message: "Model Created" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export default withApiAuthRequired(createModel);
