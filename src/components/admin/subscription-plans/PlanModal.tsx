import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlanFormData, planSchema } from "@/validation/admin/subscriptionPlanSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-select";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ISubscriptionPlan } from "./SubscriptionPlansManagement";

interface PlanModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ISubscriptionPlan) => void;
  plan?: ISubscriptionPlan | null;
}
export const PlanModal = ({open, onClose, onSave,plan}: PlanModalProps) => {
    const form = useForm<PlanFormData>({
       resolver : zodResolver(planSchema),
       defaultValues : {
            id:"",
            name: "",
            price:0,
            durationInDays: 30,
            privileges: {
               maxActiveEvents: 3,
               maxFeaturedEvents: 1,
               commissionRate: 10,
               payout: {frequency: "within-2-weeks", delayDays:14},
               supportLevel:"email"
            }
       },
    });
   useEffect(() => {
     if(plan) {
        form.reset({
          id: plan.id,
           name: plan.name,
           price: plan.price,
           durationInDays: plan.durationInDays,
           description: plan.description,
           privileges: plan. privileges,
        })
     }else{
       form.reset()
     }
   },[plan,form])

   const handleSubmit = (data: PlanFormData) => {
      onSave({...plan, ...data})
   }
      return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white p-6 rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {plan ? "Edit Subscription Plan" : "Create New Plan"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 mt-4 max-h-[75vh] overflow-y-auto pr-2"
        >
          {/* --- BASIC DETAILS --- */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Plan Name</Label>
              <Input {...form.register("name")} placeholder="Enter plan name" />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Price (₹)</Label>
              <Input type="number" {...form.register("price")} />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label>Duration (Days)</Label>
              <Input type="number" {...form.register("durationInDays")} />
              {form.formState.errors.durationInDays && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.durationInDays.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label>Description</Label>
              <Input {...form.register("description")} placeholder="Brief description of the plan" />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </section>

          {/* --- PRIVILEGES --- */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Privileges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Max Active Events</Label>
                <Input
                  type="number"
                  {...form.register("privileges.maxActiveEvents")}
                />
                {form.formState.errors.privileges?.maxActiveEvents && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.privileges.maxActiveEvents.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Max Featured Events</Label>
                <Input
                  type="number"
                  {...form.register("privileges.maxFeaturedEvents")}
                />
              </div>

              <div>
                <Label>Commission Rate (%)</Label>
                <Input
                  type="number"
                  {...form.register("privileges.commissionRate")}
                />
              </div>

              <div>
                <Label>Support Level</Label>
                <Select
                  onValueChange={(val) =>
                    form.setValue("privileges.supportLevel", val as "email" | "priority")
                  }
                  defaultValue={form.getValues("privileges.supportLevel")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select support level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payout Frequency</Label>
                <Select
                  onValueChange={(val) =>
                    form.setValue("privileges.payout.frequency", val as any)
                  }
                  defaultValue={form.getValues("privileges.payout.frequency")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="within-1-week">Within 1 week</SelectItem>
                    <SelectItem value="within-2-weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="within-1-month">Within 1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payout Delay (days)</Label>
                <Input
                  type="number"
                  {...form.register("privileges.payout.delayDays")}
                />
              </div>
            </div>
          </div>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              {plan ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 