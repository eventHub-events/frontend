import Header from "@/components/user/landing/Header";
import OTPPage from "../../../components/ui/OtpPage";
import Footer from "@/components/user/landing/Footer";

interface Props {
  params: Promise<{ userType: "user" | "organizer" }>;
}

export default async function OTPVerificationPage({ params }: Props) {
  const { userType } = await params;
  return (
    <div>
      <Header />
      <OTPPage userType={userType} />
      <Footer />
    </div>
  );
}