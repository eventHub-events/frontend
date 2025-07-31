"use client";

import SignupPage from "../../../components/ui/SignupPage";

export default function Page({ params }: { params: { userType: string } }) {
  const { userType } = params;

  // Validate userType
  if (userType !== "user" && userType !== "organizer") {
    return <div>Invalid user type</div>;
  }

  return <SignupPage userType={userType as "user" | "organizer"} />;
}
