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
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AddIcon } from "@chakra-ui/icons";
import slugify from "slugify";

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
    const orgSlug = slugify(watch("orgName") || "", { lower: true });

    const onSubmit = (data) => console.log(data);

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
                                    `/api/check_unique_org_slug?slug=${slugify(
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
                <FormHelperText>Slug: {orgSlug}</FormHelperText>
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
                    {...register("orgDesc", {
                        required: "Description is required",
                        minLength: {
                            value: 20,
                            message:
                                "Description must be of atleast 20 characters",
                        },
                    })}
                />
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
                loadingText={`Creating ${watch("orgName")}`}
            >
                Create
            </Button>
        </Box>
    );
};
