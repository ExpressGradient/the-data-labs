import { useForm, useFieldArray } from "react-hook-form";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";

export const CreateModelForm = () => {
    const { register, control, handleSubmit } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "modelField",
    });

    const onAddFieldClick = () => append({ name: "", type: "int8" });

    const onRemoveFieldClick = (index) => remove(index);

    // TODO submit form
    const onFormSubmit = () => handleSubmit((data) => console.log(data));

    return (
        <Stack as="form" direction="column" onSubmit={onFormSubmit}>
            <FormControl isRequired>
                <FormLabel htmlFor="model-name">Model Name:</FormLabel>
                <Input
                    type="text"
                    id="model-name"
                    {...register("modelName")}
                    variant="filled"
                    maxLength={50}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel htmlFor="model-desc">Model Description:</FormLabel>
                <Textarea
                    variant="filled"
                    id="model-desc"
                    {...register("modelDescription")}
                    maxLength={100}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel htmlFor="branch-name">Branch Name:</FormLabel>
                <Input
                    type="text"
                    id="branch-name"
                    {...register("branchName")}
                    variant="filled"
                    maxLength={50}
                />
            </FormControl>
            <Text color="black" fontWeight="semibold">
                Fields:
            </Text>
            <Stack>
                <Stack direction="row">
                    <FormControl>
                        <Input
                            type="text"
                            variant="filled"
                            value="id"
                            isReadOnly
                        />
                    </FormControl>
                    <FormControl>
                        <Select variant="filled" isReadOnly>
                            <option value="int8">int8</option>
                        </Select>
                    </FormControl>
                    <Button isDisabled>
                        <SmallCloseIcon />
                    </Button>
                </Stack>
                <>
                    {fields.map((field, index) => (
                        <Stack direction="row" key={field.id}>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...register(`modelField.${index}.name`)}
                                    variant="filled"
                                    placeholder="name"
                                    maxLength={30}
                                />
                            </FormControl>
                            <FormControl>
                                <Select
                                    variant="filled"
                                    {...register(`modelField.${index}.type`)}
                                >
                                    <option value="int2">int2</option>
                                    <option value="int4">int4</option>
                                    <option value="int8">int8</option>
                                    <option value="float4">float4</option>
                                    <option value="float8">float8</option>
                                    <option value="text">text</option>
                                    <option value="bool">bool</option>
                                    <option value="time">time</option>
                                    <option value="timestamp">timestamp</option>
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
            <Button colorScheme="teal" type="submit">
                Submit
            </Button>
        </Stack>
    );
};
