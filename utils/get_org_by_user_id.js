import client, { q } from "../fauna_client";

const getOrgByUserId = async (userId) =>
    await client.query(q.Paginate(q.Match(q.Index("org_by_user_id"), userId)));

export default getOrgByUserId;
