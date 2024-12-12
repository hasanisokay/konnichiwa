import SignUpForm from "@/components/signup/SignUpForm";

const signUpPage = async ({ searchParams }) => {
  const search = await searchParams;
  const redirectTo = search?.redirectTo || "/";
  return <SignUpForm redirectTo={redirectTo} />;
};

export default signUpPage;

export async function generateMetadata() {
  return {
    title: "Konnichiwa | Sign Up",
    description:
      "Create an account with Konnichiwa to start your journey in learning Japanese with personalized lessons.",
  };
}
