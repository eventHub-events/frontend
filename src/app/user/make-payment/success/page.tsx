import ProtectedRoute from "@/components/user/auth/RoleProtection";
import BookingSuccess from "@/components/user/payment/success";






export default async function PaymentSuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
      const sessionId = searchParams.session_id;
        console.log("sessionId",typeof sessionId)
      if (!sessionId) {
    return <div className="p-10 text-center text-red-600 text-xl">Invalid session</div>;
  }

  
   return (
   
     <ProtectedRoute allowedRoles={["user"]}>

       <BookingSuccess sessionId={sessionId}/>
     </ProtectedRoute>
  
   )
}