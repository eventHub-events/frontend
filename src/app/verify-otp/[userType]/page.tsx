import OTPPage from "../../../components/ui/OtpPage";

interface Props {
  params: { userType: "user" | "organizer" };
}

export default function OTPVerificationPage({ params }: Props) {
  return <OTPPage userType={params.userType} />;
}
