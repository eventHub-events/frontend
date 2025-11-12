import { Button } from "@/components/ui/button";
import { stripeOnboardingService } from "@/services/organizer/stripeOnboarding";
import { showError } from "@/utils/toastService";
import { AxiosError } from "axios";
import { useState } from "react";

export default function StripeConnectButton({organizerId,email}:{organizerId: string, email: string}) {
  const[loading, setLoading]  = useState(false);


  const handleStripeConnect = async () => {
    try{
         setLoading(true);
         const res = await stripeOnboardingService.stripeOnboard(organizerId, email);
         console.log("res-bu", res)
        
         if(res) {
           window.location.href =res.data.data.onBoardingUrl;
         }

    }catch(err){
       if(err instanceof AxiosError){
            showError(err.response?.data.message)
       }else{
          showError("Stripe onboarding failed")
       }
       
    }finally {
       setLoading(false)
    }
  }

  return (
     <Button  className="bg-green-500 hover:bg-green-700 "  onClick={handleStripeConnect} disabled = {loading}>
       {loading?"Connecting..." : "Connect with Stripe"}
     </Button>
  )
}