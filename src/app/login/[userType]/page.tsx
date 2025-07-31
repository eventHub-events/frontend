// app/login/[userType]/page.tsx
import { notFound } from "next/navigation"; // ✅ Correct import
import LoginPage from "../../../components/ui/LoginPage";

interface Props {
  params: {
    userType: string;
  };
}

export default function Login({ params }: Props) {
  const { userType } = params;

  if (userType !== "user" && userType !== "organizer") {
    notFound();
  }

  return <LoginPage userType={userType as "user" | "organizer"} />;
}
