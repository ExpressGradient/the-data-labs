import {
    Box,
    Flex,
    Heading,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { SettingsIcon, WarningIcon } from "@chakra-ui/icons";
import Link from "next/link";

const Nav = ({ title, description, picture }) => {
    const router = useRouter();
    let currentPath = "";
    const paths = router.asPath.split("/");
    const navLinks = [];
    paths.forEach((path) => {
        if (path !== "") {
            currentPath += `/${path}`;
            navLinks.push({
                path: currentPath,
                name: path,
            });
        }
    });

    return (
        <Box as="header" my="4" w={["100%", 2 / 3]} mx={["4", "auto"]}>
            <Flex justify="space-between">
                <Heading>{title}</Heading>

                <Menu colorScheme="teal">
                    <Avatar
                        src={picture}
                        as={MenuButton}
                        id="avatar-menu-button"
                    />

                    <MenuList>
                        <MenuItem icon={<SettingsIcon />} id="settings-link">
                            <Link href="/settings">
                                <a>Settings</a>
                            </Link>
                        </MenuItem>
                        <MenuItem
                            icon={<WarningIcon />}
                            id="logout-link"
                            onClick={() => router.push("/api/auth/logout")}
                        >
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            <Text fontSize="sm" color="gray">
                {description}
            </Text>

            <Flex as="nav" mt="2">
                {navLinks.map((link, index) => (
                    <Flex mr="2" key={index} align="center" id={link.path}>
                        /
                        <Box
                            color="teal"
                            _hover={{ textDecoration: "underline" }}
                            fontSize="sm"
                            ml="1"
                        >
                            <Link href={link.path}>
                                <a>{link.name}</a>
                            </Link>
                        </Box>
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
};

export default Nav;
