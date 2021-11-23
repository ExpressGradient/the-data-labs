import supabase from "../../../supabase_client";
import Ajv from "ajv";
import { nanoid } from "nanoid";

const addData = async (req, res) => {
    const { modelSlug } = req.query;

    const { model } = await supabase
        .from("models")
        .select("*")
        .eq("slug", modelSlug)
        .single();

    const inputKey = req.headers["Authorization"].split(" ")[1];

    if (inputKey === model.key) {
        const ajv = new Ajv();
        const schema = JSON.parse(model.schema);
        const validate = ajv.compile(schema);

        const data = { id: nanoid(), ...req.body };

        if (validate(data)) {
            await supabase
                .from("model_data")
                .insert([{ model: model.id, data: JSON.stringify(data) }]);

            res.status(200).json({
                status: "success",
                message: "Data successfully added",
            });
        } else {
            res.status(400).send({ error: validate.errors });
        }
    } else {
        res.status(401).send("Unauthorized");
    }
};

export default addData;
