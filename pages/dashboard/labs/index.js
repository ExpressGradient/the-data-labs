const Labs = () => <></>;

export const getStaticProps = async () => {
    return {
        redirect: {
            destination: "/dashboard#your-labs",
            permanent: true,
        },
    };
};

export default Labs;
