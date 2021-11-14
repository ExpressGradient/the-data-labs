import { GridItem, SimpleGrid, Text } from "@chakra-ui/react";
import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";

export const ModelGrid = () => {
    const router = useRouter();
    const { labSlug } = router.query;

    const { data } = useSWR(`/api/lab/model/getAll?labSlug=${labSlug}`);
    console.log(data);

    return (
        <SimpleGrid columns={[1, 4]}>
            <GridItem py={10} boxShadow="md" cursor="pointer">
                <Link href={`./${labSlug}/models/new`}>
                    <a>
                        <Text align="center">+ Create a new Model</Text>
                    </a>
                </Link>
            </GridItem>
        </SimpleGrid>
    );
};
