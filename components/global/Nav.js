import { Box, Flex, Heading, Avatar } from "@chakra-ui/react";

const Nav = ({ picture, org }) => (
    <>
        <Box as="header">
            <Box as="nav" my="4" w={["100%", 2 / 3]} mx={["4", "auto"]}>
                <Flex justify="space-between">
                    <Heading>{org}</Heading>
                    <Avatar src={picture} size="sm" />
                </Flex>
            </Box>
        </Box>
    </>
);

export default Nav;
