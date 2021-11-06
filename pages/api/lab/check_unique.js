import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import client, { q } from "../../../fauna_client";

const checkUniqueLabName = async (req, res) => {
    const { slug } = req.query;

    const { data } = await client.query(
        q.Paginate(q.Match(q.Index("lab_by_slug"), slug))
    );

    res.json({ isUnique: data.length === 0 });
};

export default withApiAuthRequired(checkUniqueLabName);
