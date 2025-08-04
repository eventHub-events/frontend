import OTPPage from "../../../components/ui/OtpPage";

interface Props {
  params: { userType: "user" | "organizer" };
}

export default async function OTPVerificationPage({ params }: Props) {
  const { userType } = await params;
  return <OTPPage userType={userType} />;
}
