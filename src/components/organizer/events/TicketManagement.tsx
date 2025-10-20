"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { EventTicketingModel } from "@/models/EventTicketingModel"; // Replace with your service import
import { TicketStatus } from "@/enums/organizer/events"; // Define Active/Inactive
import { ITicketTier } from "@/types/organizer/events"; // your type for ticket tier
import { showSuccess, showWarning } from "@/utils/toastService";

interface TicketForm {
  tickets: ITicketTier[];
  saleStartDate: string;
  saleEndDate: string;
  waitingListEnabled: boolean;
}

interface TicketManagementPageProps {
  eventId: string;
}

export default function TicketManagementPage({ eventId }: TicketManagementPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, setValue, watch } = useForm<TicketForm>({
    defaultValues: {
      tickets: [],
      saleStartDate: "",
      saleEndDate: "",
      waitingListEnabled: false,
    },
  });

  const { fields: ticketFields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  // Fetch existing ticketing data
  useEffect(() => {
    const fetchTicketing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/event-ticketing/${eventId}`);
        const data = await res.json();
        if (data?.tickets) {
          setValue("tickets", data.tickets);
          setValue("saleStartDate", data.saleStartDate?.slice(0, 10) || "");
          setValue("saleEndDate", data.saleEndDate?.slice(0, 10) || "");
          setValue("waitingListEnabled", data.waitingListEnabled);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketing();
  }, [eventId, setValue]);

  const onSubmit = async (formData: TicketForm) => {
    try {
      setLoading(true);
      const payload = {
        eventId,
        tickets: formData.tickets,
        saleStartDate: formData.saleStartDate,
        saleEndDate: formData.saleEndDate,
        waitingListEnabled: formData.waitingListEnabled,
      };

      const res = await fetch(`/api/event-ticketing/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess("Ticket tiers updated successfully!");
        router.push(`/organizer/events/${eventId}`);
      } else {
        showWarning("Failed to update ticket tiers.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Tickets</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Ticket List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ticket Tiers</h2>
              <button
                type="button"
                onClick={() =>
                  append({
                    name: "",
                    price: 0,
                    totalSeats: 1,
                    benefits: [],
                    status: TicketStatus.Active,
                    isRefundable: false,
                    description: "",
                    maxTicketPerUser: 1,
                  })
                }
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                + Add Ticket
              </button>
            </div>

            <div className="space-y-4">
              {ticketFields.map((ticket, index) => (
                <div key={ticket.id} className="border border-gray-200 p-4 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">Ticket Name</label>
                      <input
                        type="text"
                        {...register(`tickets.${index}.name` as const, { required: true })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="VIP, General"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">Price ($)</label>
                      <input
                        type="number"
                        {...register(`tickets.${index}.price` as const, { required: true, min: 0 })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">Total Seats</label>
                      <input
                        type="number"
                        {...register(`tickets.${index}.totalSeats` as const, { required: true, min: 1 })}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="100"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium">Max Tickets/User</label>
                      <input
                        type="number"
                        {...register(`tickets.${index}.maxTicketPerUser` as const)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="1"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium">Benefits</label>
                      <input
                        type="text"
                        {...register(`tickets.${index}.benefits` as const)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Free drinks, backstage pass"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium">Description</label>
                      <input
                        type="text"
                        {...register(`tickets.${index}.description` as const)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Short description"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="block text-sm font-medium">Status</label>
                      <select
                        {...register(`tickets.${index}.status` as const)}
                        className="px-3 py-2 border rounded-lg"
                      >
                        {Object.values(TicketStatus).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center space-x-2 mt-4">
                      <input
                        type="checkbox"
                        {...register(`tickets.${index}.isRefundable` as const)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Refundable</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sale Dates & Waiting List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Sale Start Date</label>
              <input
                type="date"
                {...register("saleStartDate")}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Sale End Date</label>
              <input
                type="date"
                {...register("saleEndDate")}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("waitingListEnabled")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Enable Waiting List</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Saving..." : "Save Ticket Tiers"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
