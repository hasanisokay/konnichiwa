import LoginForm from "@/components/login/LoginForm";


const loginPage = async ({ searchParams }) => {
    const search = await searchParams;
    const previousRedirect = search?.redirectTo;
    
    let redirectTo = "/"

    return (
        <div>
            <LoginForm redirectTo={redirectTo} />
        </div>
    );
};

export default loginPage;
