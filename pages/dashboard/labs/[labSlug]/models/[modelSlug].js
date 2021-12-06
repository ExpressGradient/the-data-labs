import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import supabase from "../../../../../supabase_client";
import Nav from "../../../../../components/global/Nav";
import {
    Stack,
    VStack,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Table,
    Thead,
    Tr,
    Th,
    Button,
    Badge,
    Text,
    HStack,
    Drawer,
    useDisclosure,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Tbody,
    Td,
    Heading,
    Code,
    useBoolean,
    Select,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import Script from "next/script";

const AddDataFormControl = ({ field, type, register }) => {
    switch (type) {
        case "string":
            return (
                <FormControl isRequired>
                    <FormLabel htmlFor={field}>{field}</FormLabel>
                    <Input
                        {...register(field)}
                        id={field}
                        type="text"
                        variant="filled"
                    />
                </FormControl>
            );

        case "number":
        case "integer":
            return (
                <FormControl isRequired>
                    <FormLabel htmlFor={field}>{field}</FormLabel>
                    <Input
                        {...register(field, { valueAsNumber: true })}
                        id={field}
                        type="number"
                        variant="filled"
                    />
                </FormControl>
            );

        case "boolean":
            return (
                <FormControl isRequired>
                    <FormLabel htmlFor={field}>{field}</FormLabel>
                    <Checkbox
                        id={field}
                        colorScheme="teal"
                        {...register(field)}
                    >
                        True
                    </Checkbox>
                </FormControl>
            );

        default:
            return "hey";
    }
};

const Explorer = ({ model, SSRrows }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const buttonRef = useRef();
    const { register, handleSubmit } = useForm();

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const router = useRouter();
    const { modelSlug } = router.query;
    const { data } = useSWR(
        `/api/lab/model/data/get?modelSlug=${modelSlug}`,
        fetcher
    );
    const { mutate } = useSWRConfig();

    const rows = data ? data.data : SSRrows;

    return (
        <VStack direction="column">
            <Table variant="striped">
                <Thead>
                    <Tr>
                        {Object.keys(model.schema.properties).map((field) => (
                            <Th key={field}>{field}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {rows &&
                        rows.map((row) => (
                            <Tr key={row.data.id}>
                                {Object.entries(row.data).map(
                                    ([field, value]) => (
                                        <Td key={value}>{value}</Td>
                                    )
                                )}
                            </Tr>
                        ))}
                </Tbody>
            </Table>
            <Button colorScheme="teal" ref={buttonRef} onClick={onOpen}>
                Add Data Points
            </Button>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={buttonRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Add Data</DrawerHeader>
                    <DrawerBody>
                        <VStack
                            as="form"
                            onSubmit={handleSubmit(async (data) => {
                                await fetch(
                                    `/api/lab/model/data/create?modelSlug=${modelSlug}`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(data),
                                    }
                                );

                                mutate(
                                    `/api/lab/model/data/get?modelSlug=${modelSlug}`,
                                    fetcher
                                );

                                onClose();
                            })}
                        >
                            <>
                                {Object.entries(model.schema.properties).map(
                                    ([field, { type }]) => {
                                        if (field !== "id") {
                                            return (
                                                <AddDataFormControl
                                                    key={field}
                                                    field={field}
                                                    type={type}
                                                    register={register}
                                                />
                                            );
                                        }
                                    }
                                )}
                            </>
                            <Button type="submit" colorScheme="teal">
                                Submit
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </VStack>
    );
};

const Developer = ({ apiKey }) => {
    const router = useRouter();
    const { modelSlug } = router.query;
    const [viewAble, setViewAble] = useBoolean(false);

    return (
        <Stack direction="column">
            <Heading size="md">
                API Endpoint:{" "}
                <Code>
                    https://the-data-labs.vercel.app/api/{modelSlug}/new
                </Code>
            </Heading>
            <Heading size="md">
                <Stack direction="row" align="center">
                    <Text>API Key: </Text>
                    {viewAble ? (
                        <Stack direction="row">
                            <Code>{apiKey}</Code>
                            <ViewOffIcon onClick={setViewAble.off} />
                        </Stack>
                    ) : (
                        <Stack direction="row">
                            <Code>**********************</Code>
                            <ViewIcon onClick={setViewAble.on} />
                        </Stack>
                    )}
                </Stack>
            </Heading>
        </Stack>
    );
};

const MachineLearning = ({ properties, rows }) => {
    const [globalMl5, setGlobalMl5] = useState();
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        watch,
        setValue,
        reset,
    } = useForm();
    const [globalNN, setGlobalNN] = useState();

    const trainSubmitHandler = ({
        mlTask,
        predictColumn,
        epochs,
        batchSize,
    }) => {
        // Initialize ML5 NN
        const nn = globalMl5.neuralNetwork({
            task: mlTask,
            debug: true,
        });

        // Feed Data
        rows.forEach(({ data }) => {
            const input = JSON.parse(JSON.stringify(data));
            delete input.id;
            delete input[predictColumn];

            const output = {};
            output[predictColumn] = data[predictColumn];

            nn.addData(input, output);
        });

        // Normalize Data
        nn.normalizeData();

        // Train NN
        nn.train({ epochs, batchSize }, () => setGlobalNN(nn));
    };

    const predictSubmitHandler = (data) => {
        const task = watch("mlTask");

        const predictCallback = (error, result) => {
            if (error) {
                console.log(error);
            } else {
                const predictedResult =
                    task === "regression"
                        ? result[0][watch("predictColumn")]
                        : result[0].label;

                setValue("predictColumnResult", predictedResult);
            }
        };

        task === "regression"
            ? globalNN.predict(data, predictCallback)
            : globalNN.classify(data, predictCallback);
    };

    const resetNeuralNetwork = () => {
        setGlobalNN();
        reset();
    };

    return (
        <>
            <Script
                id="ml5-js"
                src="https://unpkg.com/ml5@latest/dist/ml5.min.js"
                strategy="afterInteractive"
                onLoad={() => setGlobalMl5(ml5)}
            />

            <Stack direction="column" w={["full", 1 / 3]} mx={[0, "auto"]}>
                {globalNN ? (
                    <>
                        <Heading>Start Predicting</Heading>
                        <Stack
                            direction="column"
                            as="form"
                            spacing={4}
                            onSubmit={handleSubmit(predictSubmitHandler)}
                        >
                            <>
                                {Object.entries(properties).map(
                                    ([field, { type }]) => {
                                        if (
                                            field !== "id" &&
                                            field !== watch("predictColumn")
                                        ) {
                                            return (
                                                <AddDataFormControl
                                                    key={field}
                                                    field={field}
                                                    type={type}
                                                    register={register}
                                                />
                                            );
                                        }
                                    }
                                )}
                            </>
                            <FormControl isReadOnly>
                                <FormLabel htmlFor="predictColumn">
                                    {watch("mlTask") === "regression"
                                        ? "Predicted"
                                        : "Classified"}{" "}
                                    {watch("predictColumn")}
                                </FormLabel>
                                <Input
                                    type="text"
                                    variant="filled"
                                    {...register("predictColumnResult")}
                                />
                            </FormControl>
                            <Button
                                colorScheme="teal"
                                type="submit"
                                isLoading={isSubmitting}
                                variant="solid"
                            >
                                {watch("mlTask") === "regression"
                                    ? "Predict"
                                    : "Classify"}
                            </Button>
                            <Button onClick={resetNeuralNetwork}>
                                Reset Neural Network
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <Stack
                        direction="column"
                        spacing={4}
                        as="form"
                        onSubmit={handleSubmit(trainSubmitHandler)}
                    >
                        <FormControl isRequired>
                            <FormLabel htmlFor="task">ML Task:</FormLabel>
                            <Select
                                id="task"
                                variant="filled"
                                {...register("mlTask")}
                            >
                                <option value="regression">Regression</option>
                                <option value="classification">
                                    Classification
                                </option>
                            </Select>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel htmlFor="predict-column">
                                Predict Attribute:
                            </FormLabel>
                            <Select
                                id="predict-column"
                                variant="filled"
                                {...register("predictColumn")}
                            >
                                {Object.keys(properties).map((field) => {
                                    if (field !== "id") {
                                        return (
                                            <option key={field} value={field}>
                                                {field}
                                            </option>
                                        );
                                    }
                                })}
                            </Select>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel htmlFor="epochs">Epochs:</FormLabel>
                            <Input
                                variant="filled"
                                type="number"
                                id="epochs"
                                {...register("epochs")}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel htmlFor="batch-size">
                                Batch Size:
                            </FormLabel>
                            <Input
                                variant="filled"
                                type="number"
                                id="batch-size"
                                {...register("batchSize")}
                            />
                        </FormControl>
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Train Neural Network
                        </Button>
                    </Stack>
                )}
            </Stack>
        </>
    );
};

const ModelSlug = ({ payload }) => {
    return (
        <>
            <Nav
                title={payload.model.name}
                description={payload.model.description}
                picture={payload.picture}
            />
            <Stack
                direction="column"
                as="main"
                w={["full", 2 / 3]}
                mx={[4, "auto"]}
            >
                <Tabs isFitted>
                    <TabList>
                        <Tab>Explorer</Tab>
                        <Tab>Developer</Tab>
                        <Tab>
                            <HStack>
                                <Text>Charts</Text>
                                <Badge colorScheme="blue">Alpha</Badge>
                            </HStack>
                        </Tab>
                        <Tab>
                            <HStack>
                                <Text>Machine Learning</Text>
                                <Badge colorScheme="orange">Beta</Badge>
                            </HStack>
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Explorer
                                model={payload.model}
                                SSRrows={payload.rows}
                            />
                        </TabPanel>
                        <TabPanel>
                            <Developer apiKey={payload.model.key} />
                        </TabPanel>
                        <TabPanel></TabPanel>
                        <TabPanel>
                            <MachineLearning
                                properties={payload.model.schema.properties}
                                rows={payload.rows}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Stack>
        </>
    );
};

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps({ req, params, res }) {
        const { user } = getSession(req, res);

        const { data: orgs } = await supabase
            .from("orgs")
            .select("id")
            .eq("owner_id", user.sub);
        const orgId = orgs[0].id;

        const { data: labs } = await supabase
            .from("labs")
            .select("*")
            .eq("org", orgId)
            .eq("slug", params.labSlug);

        const { data: model } = await supabase
            .from("models")
            .select("*")
            .eq("slug", params.modelSlug)
            .single();

        if (labs.length === 0 || model === null) {
            return {
                redirect: {
                    destination: "/404",
                    permanent: false,
                },
            };
        }

        const { data: rows } = await supabase
            .from("model_data")
            .select("data")
            .eq("model", model.id);

        return {
            props: {
                payload: {
                    picture: user.picture,
                    model,
                    rows,
                },
            },
        };
    },
});

export default ModelSlug;
