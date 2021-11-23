import { GridItem, SimpleGrid, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";

export const ModelGrid = ({ models }) => {
    const router = useRouter();
    const { labSlug } = router.query;

    return (
        <SimpleGrid columns={[1, 4]} gap={3}>
            <GridItem py={10} boxShadow="md" cursor="pointer">
                <Link href={`./${labSlug}/models/new`}>
                    <a>
                        <Text align="center">+ Create a new Model</Text>
                    </a>
                </Link>
            </GridItem>
            <>
                {models.map((model, index) => (
                    <GridItem
                        key={index}
                        py={10}
                        boxShadow="md"
                        cursor="pointer"
                    >
                        <Link href={`./${labSlug}/models/${model.slug}`}>
                            <a>
                                <Text align="center">{model.name}</Text>
                            </a>
                        </Link>
                    </GridItem>
                ))}
            </>
        </SimpleGrid>
    );
};
