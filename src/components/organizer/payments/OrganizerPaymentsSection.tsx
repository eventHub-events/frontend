import { IOrganizer } from "@/types/authTypes";
import StripeConnectButton from "./StripeConnectButton";

export default function OrganizerPaymentsSection({organizer}:{organizer: IOrganizer}) {
   console.log("orga",organizer)
  return (
        <div className="p-6 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Stripe Connection</h2>

      {organizer.stripeOnboarded ? (
        <p className="text-green-600 font-semibold">✅ Connected to Stripe</p>
      ) : (
        <>
          <p className="text-gray-600 mb-3">You need to connect your account to Stripe to receive ticket payments.</p>
          <StripeConnectButton organizerId={organizer.id} email={organizer.email} />
        </>
      )}
    </div>
  )
}