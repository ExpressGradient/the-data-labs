import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Switch,
    Textarea,
    VStack,
    FormErrorMessage,
    Alert,
    AlertIcon,
    AlertDescription,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { useRouter } from "next/router";
import { useState } from "react";

export const CreateLabForm = () => {
    const {
        register,
        formState: { isSubmitting, errors },
        handleSubmit,
        watch,
    } = useForm();
    const router = useRouter();
    const [alert, setAlert] = useState(null);

    const slug = watch("name")
        ? slugify(`${watch("name")}`, { lower: true })
        : "";

    const createLab = async (formData) => {
        const res = await fetch("/api/lab/create", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                ...formData,
                slug,
            }),
        });

        const { data, error } = await res.json();

        if (error) {
            setAlert({
                status: "error",
                message: error,
            });
        }

        if (data) {
            setAlert({
                status: "success",
                message: "Lab created successfully",
            });
            setTimeout(() => router.push(`/dashboard/labs/${slug}`), 1500);
        }
    };

    return (
        <VStack
            as="form"
            w={["100%", 1 / 3]}
            mx={[4, "auto"]}
            spacing={4}
            align="stretch"
            onSubmit={handleSubmit(async (data) => await createLab(data))}
        >
            {alert && (
                <Alert status={alert.status} variant="left-accent">
                    <AlertIcon />
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            )}
            <FormControl isRequired isInvalid={errors.name}>
                <FormLabel htmlFor="lab-name-input">Name: </FormLabel>
                <Input
                    type="text"
                    id="lab-name-input"
                    variant="filled"
                    maxLength={50}
                    {...register("name", {
                        validate: {
                            slugIsNotUnique: async () => {
                                const res = await fetch(
                                    `/api/lab/check_unique?slug=${slug}`
                                );
                                const isUnique = await res.json();

                                return isUnique || "Lab already exists!";
                            },
                        },
                    })}
                />
                <FormHelperText>Slug: {slug}</FormHelperText>
                <FormErrorMessage>
                    {errors && errors.name && errors.name.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
                <FormLabel htmlFor="lab-desc-text-area">
                    Description:{" "}
                </FormLabel>
                <Textarea
                    id="lab-desc-text-area"
                    variant="filled"
                    {...register("description")}
                    maxLength={100}
                />
                <FormHelperText>
                    Max Length:{" "}
                    {watch("description") ? watch("description").length : 0} /
                    100
                </FormHelperText>
            </FormControl>
            <FormControl isRequired>
                <Box display="flex" alignItems="center">
                    <FormLabel htmlFor="enable-public-switch" my="0" mr="3">
                        Private:
                    </FormLabel>
                    <Switch
                        id="enable-public-switch"
                        colorScheme="teal"
                        size="md"
                        defaultChecked={true}
                        {...register("isPrivate")}
                    />
                </Box>
                <FormHelperText color="red.500">
                    By disabling this, your Lab will be open to the Public
                </FormHelperText>
            </FormControl>
            <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
                Submit
            </Button>
        </VStack>
    );
};
