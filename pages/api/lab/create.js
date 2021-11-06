import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import client, { q } from "../../../fauna_client";
import getOrgByUserId from "../../../utils/get_org_by_user_id";

const createLab = async (req, res) => {
    try {
        const { user } = getSession(req, res);

        const { data: orgs } = await getOrgByUserId(user.sub);
        const [orgRef] = orgs;

        const { slug } = req.body;

        await client.query(
            q.Do(
                q.CreateDatabase({ name: slug }),
                q.Create(q.Collection("Labs"), { data: { ...req.body } }),
                q.Update(orgRef, {
                    data: {
                        labs: q.Append(
                            [slug],
                            q.Select(["data", "labs"], q.Get(orgRef))
                        ),
                    },
                })
            )
        );

        res.json({ data: `${req.body.name} Lab created successfully` });
    } catch (error) {
        console.error("Error while creating a Lab", error);
        res.json({ error });
    }
};

export default withApiAuthRequired(createLab);
