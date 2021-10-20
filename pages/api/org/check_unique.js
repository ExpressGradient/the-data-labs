import checkUniqueOrgSlugUtil from "../../../utils/check_unique_org_slug";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

const checkUniqueOrgSlug = async (req, res) => {
    const { slug } = req.query;

    const { data } = await checkUniqueOrgSlugUtil(slug);

    res.json({ isUnique: data.length === 0 });
};

export default withApiAuthRequired(checkUniqueOrgSlug);
