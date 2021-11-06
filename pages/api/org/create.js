import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import client, { q } from "../../../fauna_client";

const createOrg = async (req, res) => {
    try {
        const { name, slug, desc } = req.body;
        const { user } = getSession(req, res);

        await client.query(
            q.Create(q.Collection("Orgs"), {
                data: {
                    owner: user.sub,
                    name,
                    slug,
                    desc,
                    labs: [],
                },
            })
        );

        res.json({ message: "Organization created" });
    } catch (error) {
        console.error(`Failed while creating an Org ${error}`);
        res.status(500).json({ error });
    }
};

export default withApiAuthRequired(createOrg);
