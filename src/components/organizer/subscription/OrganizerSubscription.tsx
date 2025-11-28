"use client";

import { useEffect, useState } from "react";
import { ISubscriptionPlan } from "@/components/admin/subscription-plans/SubscriptionPlansManagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Check } from "lucide-react";
import { subscriptionService } from "@/services/organizer/subscriptionService";
import { useAppSelector } from "@/redux/hooks";

export enum SubscriptionStatus {
   Pending ="pending",
   Active = "active",
   Expired = "expired",
   Cancelled = "cancelled"
}
export interface ICurrentPlan {
          organizerId: string,
          organizerName: string,
          organizerEmail : string,
          planId: string,
          planName: string,
          startDate?: Date,
          price?:number,
          endDate?: Date,
          status:SubscriptionStatus,
          paymentId?: string,
          id?: string
}
export default function OrganizerSubscription() {
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<ICurrentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const organizerId = organizer?.id

  useEffect(() => {
    fetchPlans();
    fetchCurrentPlan(); // Fetch organizer's current subscription
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await subscriptionService.fetchAllSubscriptionPlans();
      setPlans(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching plans", err);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
        if(!organizerId) return 
      const res = await subscriptionService.fetchCurrentSubscription(organizerId);
      console.log("rrrrr", res)
      setCurrentPlan(res.data.data || null);
    } catch (err) {
      console.log("No active plan found (new organizer)");
      setCurrentPlan(null);
    }
  };

  const handlePurchaseOrUpgrade = async (plan: ISubscriptionPlan) => {
    // const action = currentPlan ? "upgrade" : "purchase";
    // const confirmed = window.confirm(
    //   `Do you want to ${action} the ${plan.name} plan for ₹${plan.price}/month?`
    // );
    // if (!confirmed) return;

    // try {
    //   setIsLoading(true);
    //   const res = await subscriptionPlansService.subscribeToPlan(plan._id);
    //   if (res.status === 200) {
    //     alert("Subscription successful!");
    //     setCurrentPlan(plan);
    //   }
    // } catch (err: any) {
    //   console.error(err);
    //   alert(err.response?.data?.message || "Something went wrong");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  
   const handleBuyPlan = async (plan: ISubscriptionPlan) => {
  try {
    const response = await subscriptionService.subscriptionCheckout( {
      planName: plan.name,
      price: plan.price,
      planId: plan.id!,
      durationInDays: plan.durationInDays,
      organizerName: organizer?.name!,
      organizerEmail : organizer?.email!,
      payoutDelayDays: plan.privileges.payout.delayDays,
      subscriptionType : currentPlan?"upgrade":"new",
      commissionRate : plan.privileges.commissionRate
    });
     console.log("rseses", response);
     
    window.location.href = response.data.data; // Redirect to Stripe Checkout
  } catch (error) {
    console.error("Checkout error:", error);
  }
};

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Subscription & Billing</h2>
          <p className="text-gray-500 text-sm">
            Manage your subscription and purchase a new plan
          </p>
        </div>

     {currentPlan ? (
  <div className="bg-blue-50 px-5 py-3 rounded-lg border border-blue-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
    <div>
      <p className="text-sm text-blue-700 font-semibold">
        {currentPlan.planName} Plan
      </p>
      <p className="text-xs text-gray-500">
        {currentPlan.status === SubscriptionStatus.Active
          ? "Your subscription is active"
          : currentPlan.status === SubscriptionStatus.Pending
          ? "Awaiting activation"
          : "Subscription expired"}
      </p>

      {currentPlan.startDate && currentPlan.endDate && (
        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-1 text-xs text-gray-600">
          <span>
            <strong>Start Date:</strong>{" "}
            {new Date(currentPlan.startDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="hidden md:inline">•</span>
          <span>
            <strong>Expiry Date:</strong>{" "}
            {new Date(currentPlan.endDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      )}
    </div>

 <div className="flex items-center justify-center md:justify-end mt-2 md:mt-0">
  <span
    className={`px-3 py-1 text-[0.75rem] font-semibold rounded-full leading-none border ${
      currentPlan.status === SubscriptionStatus.Active
        ? "bg-green-100 text-green-700 border-green-200"
        : currentPlan.status === SubscriptionStatus.Pending
        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
        : currentPlan.status === SubscriptionStatus.Expired
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-gray-100 text-gray-700 border-gray-200"
    }`}
  >
    {currentPlan.status.charAt(0).toUpperCase() +
      currentPlan.status.slice(1)}
  </span>
</div>


  </div>
) : (
  <Badge className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md">
    No Active Plan
  </Badge>
)}

      </div>

      {/* Subscription Plans (Monthly only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {plans.map((plan, i) => {
          const isCurrent = currentPlan?.planId === plan.id;
          const isFreePlan = plan.price === 0;

          return (
            <Card
              key={i}
              className={`relative border ${
                isCurrent ? "border-blue-500 shadow-lg" : "border-gray-200"
              } bg-white hover:shadow-md transition-all`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                {plan.name === "Professional" && (
                  <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-700">
                    Most Popular
                  </Badge>
                )}

                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{plan.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{plan.description}</p>

                  <div className="my-3">
                    <p className="text-3xl font-bold text-gray-900">
                      {isFreePlan ? "Free" : `₹${plan.price}`}
                      <span className="text-base font-normal text-gray-500"> /month</span>
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 w-4 h-4" />
                      Up to {plan.privileges.maxActiveEvents} active events
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 w-4 h-4" />
                      {plan.privileges.supportLevel === "priority"
                        ? "Priority email support"
                        : "Email support"}
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 w-4 h-4" />
                      Commission rate: {plan.privileges.commissionRate}%
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="text-green-500 w-4 h-4" />
                      Payout delay: {plan.privileges.payout.delayDays} days
                    </li>
                    {plan.name !== "Starter" && (
                      <li className="flex items-center gap-2">
                        <Check className="text-green-500 w-4 h-4" />
                        Advanced analytics & insights
                      </li>
                    )}
                  </ul>
                </div>

                {/* Purchase/Upgrade Button */}
                <div className="mt-6">
                  {isCurrent ? (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full bg-gray-100 text-gray-600"
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleBuyPlan(plan)}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {currentPlan && currentPlan.price! < plan.price
                        ? `Upgrade to ${plan.name}`
                        : `Purchase ${plan.name}`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Plan Summary */}
      {/* {currentPlan && ( */}
        {/* // <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        //   <Card>
        //     <CardContent className="p-4">
        //       <p className="text-sm text-gray-500">Events This Month</p>
        //       <h3 className="text-lg font-semibold text-gray-800">2 of 3 events used</h3>
        //       <div className="w-full bg-gray-200 h-2 rounded mt-2">
        //         <div className="bg-blue-500 h-2 rounded" style={{ width: "67%" }} />
        //       </div>
        //     </CardContent>
        //   </Card> */}

          {/* <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Attendees</p>
              <h3 className="text-lg font-semibold text-gray-800">670</h3>
              <p className="text-xs text-gray-400">Unlimited with Pro</p>
            </CardContent>
          </Card> */}

          {/* <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Support Level</p>
              <h3 className="text-lg font-semibold text-gray-800">
                {currentPlan?.privileges.supportLevel === "priority"
                  ? "Pro Support"
                  : "Basic Email"}
              </h3>
              <p className="text-xs text-gray-400">
                {currentPlan?.privileges.supportLevel === "priority"
                  ? "Priority email and chat support"
                  : "Email support only"}
              </p>
            </CardContent>
        //   </Card> */}
        {/* // </div> */}
      
    </div>
  );
}
