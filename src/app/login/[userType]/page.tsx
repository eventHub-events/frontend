import LoginPage from "../../../components/ui/LoginPage";

interface Props {
  params: Promise<{ userType: "user" | "organizer" | "admin" }>;
}

export default async function Login({ params }: Props) {
   const { userType } = await params; // Add 'await' here
  return <LoginPage userType={userType} />;
}