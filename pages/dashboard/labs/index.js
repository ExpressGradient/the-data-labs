const Labs = () => <></>;

export const getServerSideProps = async () => {
    return {
        redirect: {
            destination: "/dashboard",
            permanent: true,
        },
    };
};

export default Labs;
