import {
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Alert,
    Heading,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    FormErrorMessage,
    Textarea,
    useToast,
    Flex,
    InputGroup,
    InputLeftElement,
    Grid,
    GridItem,
    Text,
    Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import slugify from "slugify";
import { useRouter } from "next/router";
import useSWR from "swr";

export const DashboardAlert = () => (
    <Box mx={[4, "auto"]} mt="32" w={["100%", "50%"]}>
        <Alert status="warning" justifyContent="center">
            <AlertIcon />
            <AlertTitle>Email not verified.</AlertTitle>
            <AlertDescription>
                After the verification, logout and sign in again.
            </AlertDescription>
        </Alert>
        <Link href="/api/auth/logout">
            <a>
                <Button mt="4" colorScheme="red">
                    Logout
                </Button>
            </a>
        </Link>
    </Box>
);

export const DashboardCreateOrgForm = () => {
    const {
        register,
        watch,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm();

    const toast = useToast();

    const router = useRouter();

    const orgNameSlug = slugify(watch("orgName") || "", { lower: true });
    const orgDescLength = (watch("orgDesc") || "").length;

    const onSubmit = async ({ orgName, orgDesc }) => {
        const res = await fetch("/api/org/create", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                name: orgName,
                desc: orgDesc,
                slug: orgNameSlug,
            }),
        });

        const { error } = await res.json();

        if (!error) {
            toast({
                title: `${orgName} created`,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            setTimeout(() => router.reload(), 2100);
        } else {
            toast({
                title: `Failed to create ${orgName}`,
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
        }
    };

    return (
        <Box
            my="4"
            w={["100%", 1 / 3]}
            mx={["4", "auto"]}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Heading>Create an Organization</Heading>
            <FormControl
                mt="4"
                id="orgNameFormControl"
                isInvalid={errors.orgName}
                isRequired={true}
            >
                <FormLabel htmlFor="orgName">Organization Name</FormLabel>
                <Input
                    id="orgName"
                    type="text"
                    variant="filled"
                    {...register("orgName", {
                        required: "Org name is required",
                        validate: {
                            isUnique: async (value) => {
                                const res = await fetch(
                                    `/api/org/check_unique?slug=${slugify(
                                        value,
                                        { lower: true }
                                    )}`
                                );
                                const { isUnique } = await res.json();
                                return isUnique || "Org Name is already taken";
                            },
                        },
                    })}
                />
                <FormHelperText>Slug: {orgNameSlug}</FormHelperText>
                <FormErrorMessage as="p">
                    {errors.hasOwnProperty("orgName") &&
                        errors.orgName.hasOwnProperty("message") &&
                        errors.orgName.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl
                mt="4"
                id="orgDescFormControl"
                isInvalid={errors.orgDesc}
                isRequired={true}
            >
                <FormLabel htmlFor="orgDesc">
                    Organization Description
                </FormLabel>
                <Textarea
                    id="orgDesc"
                    variant="filled"
                    maxLength={100}
                    {...register("orgDesc", {
                        required: "Description is required",
                        maxLength: {
                            value: 100,
                            message:
                                "Description must be a maximum of 100 characters",
                        },
                    })}
                />
                <FormHelperText>{orgDescLength}/100 Characters</FormHelperText>
                <FormErrorMessage as="p">
                    {errors.hasOwnProperty("orgDesc") &&
                        errors.orgDesc.hasOwnProperty("message") &&
                        errors.orgDesc.message}
                </FormErrorMessage>
            </FormControl>
            <Button
                type="submit"
                colorScheme="teal"
                mt="4"
                leftIcon={<AddIcon />}
                isLoading={isSubmitting}
                loadingText={`Creating`}
            >
                Create
            </Button>
        </Box>
    );
};

export const LabSearchBar = () => {
    const { register } = useForm();

    return (
        <Flex as="form">
            <FormControl isRequired>
                <FormLabel htmlFor="labSearch" display="none">
                    Search your labs
                </FormLabel>
                <InputGroup>
                    <InputLeftElement pointerEvents={false}>
                        <SearchIcon />
                    </InputLeftElement>
                    <Input
                        type="search"
                        id="labSearch"
                        {...register("labSearchInput")}
                    />
                </InputGroup>
            </FormControl>
            <Button type="submit" colorScheme="teal" mx="2" variant="outline">
                Search
            </Button>
        </Flex>
    );
};

const fetcher = (url) => fetch(url).then((r) => r.json());

export const LabsUnderOrg = ({ ssrLabs }) => {
    const { data: labs } = useSWR("/api/lab/getAll", fetcher, {
        fallbackData: ssrLabs,
    });
    const router = useRouter();

    return (
        <Box>
            <Heading size="lg" mb="4" id="your-labs">
                Your Labs
            </Heading>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                <GridItem
                    boxShadow="md"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                    colSpan={[4, 1]}
                    py={[10, 0]}
                    onClick={() => router.push("/dashboard/labs/new")}
                >
                    <Box>
                        <Flex justifyContent="center">
                            <AddIcon />
                        </Flex>
                        <Text fontSize="sm">Create a new Lab</Text>
                    </Box>
                </GridItem>
                <>
                    {labs.map((lab) => (
                        <GridItem
                            key={lab.id}
                            boxShadow="md"
                            p={3}
                            cursor="pointer"
                            colSpan={[4, 1]}
                        >
                            <Text fontSize="lg" fontWeight="semibold">
                                {lab.name}
                            </Text>
                            <Text fontSize="sm" color="gray" mt={3}>
                                {lab.description}
                            </Text>
                            <Badge
                                colorScheme={lab.isPrivate ? "green" : "red"}
                                mt={2}
                            >
                                {lab.isPrivate ? "Private" : "Public"}
                            </Badge>
                        </GridItem>
                    ))}
                </>
            </Grid>
        </Box>
    );
};
