import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
    Alert,
    AlertTitle,
    AlertIcon,
    AlertDescription,
    Box,
} from "@chakra-ui/react";

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

    return <h1>Dashboard</h1>;
};

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps({ req }) {
        const { user } = getSession(req);

        return { props: { emailVerified: user.email_verified } };
    },
});

export default Dashboard;
