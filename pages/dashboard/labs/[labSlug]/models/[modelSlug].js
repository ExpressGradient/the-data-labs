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
} from "@chakra-ui/react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

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
                        {Object.keys(JSON.parse(model.schema).properties).map(
                            (field) => (
                                <Th key={field}>{field}</Th>
                            )
                        )}
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
                                {Object.entries(
                                    JSON.parse(model.schema).properties
                                ).map(([field, { type }]) => {
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
                                })}
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
                                <Badge colorScheme="blue">Alpha</Badge>
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
                    </TabPanels>
                </Tabs>
            </Stack>
        </>
    );
};

export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps({ req, params, res, query }) {
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
