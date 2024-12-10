import LoginForm from "@/components/login/LoginForm";


const loginPage = async ({ searchParams }) => {
    const search = await searchParams;
    const redirectTo = search?.redirectTo || "/";

    return (
        <div>
            <LoginForm redirectTo={redirectTo} />
        </div>
    );
};

export default loginPage;
