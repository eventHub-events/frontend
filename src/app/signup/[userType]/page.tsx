import SignupPage from "../../../components/ui/SignupPage";

interface Props {
  params: Promise<{ userType: string }>;
}

export default async function Page({ params }: Props) {
  const { userType } = await params;

  // Validate userType
  if (userType !== "user" && userType !== "organizer") {
    return <div>Invalid user type</div>;
  }

  return <SignupPage userType={userType as "user" | "organizer"} />;
}