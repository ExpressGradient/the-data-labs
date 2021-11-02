import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Switch,
    Textarea,
} from "@chakra-ui/react";

export const CreateLabForm = () => {
    return (
        <Box as="form" w={["100%", 2 / 3]} mx={[4, "auto"]}>
            <FormControl>
                <FormLabel htmlFor="lab-name-input">Name: </FormLabel>
                <Input type="text" id="lab-name-input" />
            </FormControl>
            <FormControl my={4}>
                <FormLabel htmlFor="lab-desc-text-area">
                    Description:{" "}
                </FormLabel>
                <Textarea id="lab-desc-text-area" />
            </FormControl>
            <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="enable-public-switch" my="0" mr="3">
                    Enable anyone to view?:{" "}
                </FormLabel>
                <Switch
                    id="enable-public-switch"
                    colorScheme="teal"
                    size="md"
                />
            </FormControl>
        </Box>
    );
};
