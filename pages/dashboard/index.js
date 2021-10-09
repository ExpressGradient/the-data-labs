import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
  Box,
  Flex,
  Heading,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  Input,
  InputLeftAddon,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";

const Navbar = () => {
  return (
    <Flex
      as="nav"
      justifyContent="space-between"
      align="center"
      mx="auto"
      w={["100%", 3 / 4]}
      py="6"
      px={[4, 0]}
    >
      <Heading size="lg" as="h4">
        The Data Labs
      </Heading>
      <Menu isLazy id="menu-btn">
        <MenuButton
          as={Avatar}
          name="Express Gradient"
          src="https://avatars.githubusercontent.com/u/59659961?v=4"
          cursor="pointer"
        />
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const Dashboard = (props) => {
  if (!props.emailVerified) {
    return (
      <Box mx={[4, "auto"]} mt="32" w={["100%", "50%"]}>
        <Alert status="warning" justifyContent="center">
          <AlertIcon />
          <AlertTitle>Email not Verified!</AlertTitle>
          <AlertDescription>
            Please check your Inbox for the Verification Link.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <InputGroup mx="auto" w={["90%", 3 / 4]} mt={[0, 10]}>
        <InputLeftAddon>
          <SearchIcon />
        </InputLeftAddon>
        <Input type="text" placeholder="Search" />
        <Button colorScheme="facebook" ml="2">
          Go
        </Button>
      </InputGroup>
      <Flex justifyContent="center" my="32">
        <Button colorScheme="whatsapp" variant="solid">
          <AddIcon mr="2" />
          New Project
        </Button>
      </Flex>
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req }) {
    const { user } = getSession(req);

    return { props: { emailVerified: user.email_verified } };
  },
});

export default Dashboard;
