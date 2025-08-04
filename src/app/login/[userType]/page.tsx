
import LoginPage from "../../../components/ui/LoginPage";

interface Props {
  params: { userType: "user" | "organizer" | "admin" };
}

export default async  function Login({ params }: Props) {
   const { userType } = await params;
  return <LoginPage userType={userType} />;
}