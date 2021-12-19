import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";

const NavBar = () => (
    <Flex
        as="nav"
        align="center"
        padding="4"
        justifyContent="space-between"
        mx="auto"
        w={["100%", 2 / 3]}
    >
        <Heading as="h4" size="lg">
            The Data Labs
        </Heading>
        <Link href="/api/auth/login?returnTo=/dashboard">
            <a>
                <Button variant="outline" colorScheme="teal">
                    Login
                </Button>
            </a>
        </Link>
    </Flex>
);

const Home = () => (
    <>
        <Box as="header" w="100%">
            <NavBar />
        </Box>
        <Box as="main">
            <Center p="4" mt="16">
                <Box>
                    <Heading as="h1" size="2xl" mb="4">
                        Data Science made Cheaper
                    </Heading>
                    <Flex align="center">
                        <Link href="/api/auth/login?returnTo=/dashboard">
                            <a>
                                <Button
                                    variant="solid"
                                    colorScheme="teal"
                                    size="lg"
                                >
                                    Get Started
                                </Button>
                            </a>
                        </Link>
                        <Box
                            ml="4"
                            color="teal"
                            _hover={{
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            fontWeight="semibold"
                            fontSize="lg"
                        >
                            <Link href="/about">
                                <a>Learn more...</a>
                            </Link>
                        </Box>
                    </Flex>
                </Box>
            </Center>
        </Box>
    </>
);

export default Home;
