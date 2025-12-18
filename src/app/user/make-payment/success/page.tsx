import SuccessClient from "@/components/user/payment/SuccessClient";
import { Suspense } from "react";


export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="p-10 text-center text-gray-600">
        Loading payment details...
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}
