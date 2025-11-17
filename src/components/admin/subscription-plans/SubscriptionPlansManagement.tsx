"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react";
import { useEffect, useState } from "react";
// import { PlanModal } from "./PlanModal";
import { toast } from "react-toastify";
import { subscriptionPlansService } from "@/services/admin/subscriptionPlansService";
import { PlanModal } from "./PlanModal";
import { showSuccess } from "@/utils/toastService";



interface IPrivileges {
  maxActiveEvents: number;
  maxFeaturedEvents: number;
  payout: {
    frequency: "within-1-week" | "within-2-weeks" | "within-1-month";
    delayDays: number;
  };
  supportLevel: "email" | "priority";
  commissionRate: number;
}

export interface ISubscriptionPlan {
  id?: string;
  name: string;
  price: number;
  durationInDays: number;
  description: string;
  privileges: IPrivileges;
  isActive?: boolean;
  subscribers?: number;
  revenue?: number;
  conversionRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function SubscriptionPlansManagement() {
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrganizers: 0,
    monthlyRevenue: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ISubscriptionPlan | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = () => {
    setSelectedPlan(null);
    setShowModal(true);
  };

  const handleEdit = (plan: ISubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSave = async (data: ISubscriptionPlan) => {
    if (selectedPlan) {
        console.log("selectedPlan", selectedPlan);
        console.log("data", data)
      const updated = await subscriptionPlansService.updateSubscription(selectedPlan.id!, data);
      setPlans((prev) =>
        prev.map((p) => (p.id === updated.data.data.id ? updated.data.data : p))
      );
      toast.success("Plan updated successfully");
    } else {
      const created = await subscriptionPlansService.createSubscription(data);
      setPlans((prev) => [...prev, created.data.data]);
      toast.success("Plan created successfully");
    }
    setShowModal(false);
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await subscriptionPlansService.fetchAllSubscription();
      console.log("ress", res)
      setPlans(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleStatus = async (id: string, status: string) => {
      try{
         
       const res = await subscriptionPlansService.updateSubscriptionStatus(id, status);
          if(res) {
            const actionText =
        status === "block"
          ? "blocked"
          : status === "unblock"
          ? "unblocked"
          : status === "activate"
          ? "activated"
          : "deactivated";

      showSuccess(`Subscription Plan ${actionText} successfully`);
           const updated = plans.map((p) =>
                p.id === id ? { ...p, isActive: !p.isActive } : p);
            setPlans(updated)
          }
      }catch(err){
         console.log(err)
      }
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Subscription Plans Management</h2>
        <p className="text-gray-500 text-sm">
          Manage subscription plans and monitor revenue performance
        </p>
      </div>

      {/* Create Button */}
      <div className="flex justify-between items-center mt-4">
        <h3 className="text-lg font-semibold">Subscription Plans</h3>
        <Button
          onClick={handleCreate}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          + Create Plan
        </Button>
      </div>

      {/* 🧠 Conditional Rendering Section */}
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <p className="text-gray-500 text-sm">Loading subscription plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex items-center justify-center h-80">
          <p className="text-gray-500 text-sm">No subscription plans found...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {Array.isArray(plans) && plans.map((plan) => (
            <Card
              key={plan.id}
              className="relative shadow-sm border border-gray-200 hover:shadow-md transition-all bg-white"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                {plan.price > 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-100 text-red-600">
                    Most Popular
                  </Badge>
                )}

                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{plan.name}</h4>
                  <p className="text-sm text-gray-500">{plan.description}</p>

                  <div className="my-3">
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{plan.price}
                      <span className="text-base font-normal text-gray-500"> /month</span>
                    </p>
                  </div>

                  <div className="text-sm mt-2 space-y-1">
                    <p className="text-blue-700 font-medium">
                      {plan.subscribers?.toLocaleString() || 0} Subscribers
                    </p>
                    <p className="text-green-600 font-medium">
                      ₹{plan.revenue?.toLocaleString() || 0} Monthly Revenue
                    </p>
                    <p className="text-purple-600 font-medium">
                      {plan.conversionRate ? `${plan.conversionRate}%` : "—"} Conversion Rate
                    </p>
                  </div>

                  {/* Privileges */}
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>🎟️ Max Active Events: {plan.privileges.maxActiveEvents}</li>
                    <li>⭐ Max Featured Events: {plan.privileges.maxFeaturedEvents}</li>
                    <li>💰 Commission Rate: {plan.privileges.commissionRate}%</li>
                    <li>
                      ⏱️ Payout: {plan.privileges.payout.frequency.replace("-", " ")} (
                      {plan.privileges.payout.delayDays} days delay)
                    </li>
                    <li>📧 Support: {plan.privileges.supportLevel}</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    className="w-1/2 mr-2"
                    onClick={() => handleEdit(plan)}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={()=>handleStatus(plan.id!,plan.isActive?"block":"unblock")}
                    variant="destructive"
                    className="w-1/2 ml-2"
                    // disabled={!plan.isActive}
                  >
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PlanModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}
