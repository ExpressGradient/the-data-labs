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
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AddIcon } from "@chakra-ui/icons";
import slugify from "slugify";
import { useRouter } from "next/dist/client/router";

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

        const { message, error } = await res.json();

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
