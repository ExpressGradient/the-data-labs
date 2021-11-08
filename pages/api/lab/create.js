import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../supabase_client";

const createLab = async (req, res) => {
    try {
        const { user } = getSession(req);

        const { data: orgs } = await supabase
            .from("orgs")
            .select("*")
            .eq("owner_id", user.sub);

        const org = orgs[0];

        const { error } = await supabase
            .from("labs")
            .insert([{ ...req.body, org: org.id }]);

        if (error) {
            console.error("Error while creating a Lab", error);
            res.json({ error });
        } else {
            res.json({ data: `${req.body.name} Lab created successfully` });
        }
    } catch (error) {
        console.error("Error while creating a Lab", error);
        res.json({ error });
    }
};

export default withApiAuthRequired(createLab);
