const Labs = () => <></>;

export const getServerSideProps = async () => {
    return {
        redirect: {
            destination: "/dashboard#your-labs",
            permanent: true,
        },
    };
};

export default Labs;
