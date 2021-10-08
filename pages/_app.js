import { ChakraProvider } from "@chakra-ui/react";
import theme from "../chakra_theme";
import "inter-ui/inter.css";
import Head from "next/head";
import { UserProvider } from "@auth0/nextjs-auth0";

function MyApp({ Component, pageProps }) {
    return (
        <UserProvider>
            <ChakraProvider theme={theme}>
                <Head>
                    <title>The Data Labs</title>
                    <meta
                        name="description"
                        content="Data Science made Cheaper"
                    />
                </Head>
                <Component {...pageProps} />
            </ChakraProvider>
        </UserProvider>
    );
}

export default MyApp;
