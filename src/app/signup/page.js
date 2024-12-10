import SignUpForm from "@/components/signup/SignUpForm";


const signUpPage = async ({ searchParams }) => {
    const search = await searchParams;
    const redirectTo = search?.redirectTo || "/";
    return <SignUpForm redirectTo={redirectTo}/>
};

export default signUpPage;