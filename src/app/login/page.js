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


export async function generateMetadata() {
    return {
        title: "Konnichiwa | Login",
        description: "Log in to your Konnichiwa account to continue learning Japanese and access your lessons."
      }
  }
