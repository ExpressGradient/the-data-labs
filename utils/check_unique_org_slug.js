import client, { q } from "../fauna_client";

const checkUniqueOrgSlug = async (slug) =>
    await client.query(q.Paginate(q.Match(q.Index("unique_org_slug"), slug)));

export default checkUniqueOrgSlug;
