import { useForm, useFieldArray } from "react-hook-form";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    Select,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import slugify from "slugify";
import { useRouter } from "next/router";
import { useState } from "react";

export const CreateModelForm = () => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "modelField",
    });

    const router = useRouter();

    const [alert, setAlert] = useState("");

    const onAddFieldClick = () => append({ name: "", type: "string" });

    const onRemoveFieldClick = (index) => remove(index);

    const submitHandler = async (data) => {
        const { labSlug } = router.query;

        const modelSlug = slugify(`${watch("modelName")}`, { lower: true });

        const res = await fetch("/api/lab/model/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                labSlug,
                modelSlug,
            }),
        });

        const { message, error } = await res.json();

        if (message) {
            setAlert({
                type: "success",
                message,
            });

            setTimeout(
                () =>
                    router.push(
                        `/dashboard/labs/${labSlug}/models/${modelSlug}`
                    ),
                1500
            );
        } else if (error) {
            setAlert({
                type: "error",
                message: `Error occurred in creating ${data.modelName}`,
            });

            setTimeout(() => setAlert(null), 2000);
        }
    };

    return (
        <Stack
            as="form"
            direction="column"
            onSubmit={handleSubmit(submitHandler)}
        >
            {alert && (
                <Alert status={alert.type}>
                    <AlertIcon />
                    <AlertTitle>{alert.message}</AlertTitle>
                </Alert>
            )}
            <FormControl isRequired>
                <FormLabel htmlFor="model-name">Model Name:</FormLabel>
                <Input
                    type="text"
                    id="model-name"
                    {...register("modelName", {
                        validate: {
                            isUnique: async () => {
                                const { labSlug } = router.query;

                                const res = await fetch(
                                    "/api/lab/model/check_unique_name",
                                    {
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        method: "POST",
                                        body: JSON.stringify({
                                            modelSlug: slugify(
                                                watch("modelName"),
                                                { lower: true }
                                            ),
                                            labSlug,
                                        }),
                                    }
                                );

                                const { isUnique } = await res.json();

                                return isUnique || "Model already exists";
                            },
                        },
                    })}
                    variant="filled"
                    maxLength={50}
                />
                <FormHelperText>
                    Slug:{" "}
                    {watch("modelName") &&
                        slugify(`${watch("modelName")}`, { lower: true })}
                </FormHelperText>
                <FormErrorMessage>
                    {errors && errors.modelName && errors.modelName.message}
                </FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
                <FormLabel htmlFor="model-desc">Model Description:</FormLabel>
                <Textarea
                    variant="filled"
                    id="model-desc"
                    {...register("modelDescription")}
                    maxLength={100}
                />
                <FormHelperText>
                    Max:{" "}
                    {watch("modelDescription")
                        ? watch("modelDescription").length
                        : 0}{" "}
                    / 100
                </FormHelperText>
            </FormControl>
            <Text color="black" fontWeight="semibold">
                Fields:
            </Text>
            <Stack>
                <Stack direction="row">
                    <FormControl>
                        <FormLabel htmlFor="idInput" hidden>
                            Id
                        </FormLabel>
                        <Input
                            type="text"
                            variant="filled"
                            value="id"
                            isReadOnly
                            id="idInput"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="typeInput" hidden>
                            Id Type
                        </FormLabel>
                        <Select variant="filled" isReadOnly id="typeInput">
                            <option value="integer">Integer</option>
                        </Select>
                    </FormControl>
                    <Button isDisabled>
                        <SmallCloseIcon />
                    </Button>
                </Stack>
                <>
                    {fields.map((field, index) => (
                        <Stack direction="row" key={field.id}>
                            <FormControl isRequired>
                                <FormLabel htmlFor={`name-${index}`} hidden>
                                    Field Name
                                </FormLabel>
                                <Input
                                    type="text"
                                    {...register(`modelFields.${index}.name`)}
                                    variant="filled"
                                    placeholder="name"
                                    maxLength={30}
                                    id={`name-${index}`}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel htmlFor={`type-${index}`} hidden>
                                    Field Type
                                </FormLabel>
                                <Select
                                    variant="filled"
                                    {...register(`modelFields.${index}.type`)}
                                    id={`type-${index}`}
                                >
                                    <option value="string">String</option>
                                    <option value="number">Number</option>
                                    <option value="integer">Integer</option>
                                    <option value="boolean">Boolean</option>
                                </Select>
                            </FormControl>
                            <Button onClick={() => onRemoveFieldClick(index)}>
                                <SmallCloseIcon />
                            </Button>
                        </Stack>
                    ))}
                </>
                <Button
                    colorScheme="teal"
                    variant="outline"
                    onClick={onAddFieldClick}
                >
                    Add a Field
                </Button>
            </Stack>
            <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
                Submit
            </Button>
        </Stack>
    );
};
