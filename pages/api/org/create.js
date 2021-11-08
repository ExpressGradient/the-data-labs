import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import supabase from "../../../supabase_client";

const createOrg = async (req, res) => {
    try {
        const { name, slug, desc } = req.body;
        const { user } = getSession(req, res);

        const { data, error } = await supabase
            .from("orgs")
            .insert([{ owner_id: user.sub, name, slug, description: desc }]);

        if (error) {
            console.error(`Failed while creating an Org: ${error}`);
            res.status(500).json({ error });
        } else {
            res.json({ message: `${name} Org created successfully` });
        }
    } catch (error) {
        console.error(`Failed while creating an Org: ${error}`);
        res.status(500).json({ error });
    }
};

export default withApiAuthRequired(createOrg);
