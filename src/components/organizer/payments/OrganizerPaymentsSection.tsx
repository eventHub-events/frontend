import StripeConnectButton from "./StripeConnectButton";

interface StripeAccount {
  id: string;
  label: string;
  onboarded: boolean;
  isDefault: boolean;
}

interface Props {
  stripeAccounts: StripeAccount[];
  organizerId: string;
  organizerEmail: string;
}

export default function OrganizerPaymentsSection({
  stripeAccounts,
  organizerId,
  organizerEmail,
}: Props) {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Payout Accounts</h2>
        <p className="text-sm text-gray-500">
          Manage Stripe accounts where your event earnings will be paid.
        </p>
      </div>

      {/* Existing Accounts */}
      <div className="space-y-3">
        {stripeAccounts.length === 0 && (
          <p className="text-gray-500 text-sm">
            No Stripe accounts connected yet.
          </p>
        )}

        {stripeAccounts.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between p-4 border rounded-xl"
          >
            <div>
              <p className="font-medium">{acc.label}</p>
              <p className="text-sm text-gray-500">
                {acc.onboarded ? "Connected" : "Onboarding required"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {acc.isDefault && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  Default
                </span>
              )}

              {!acc.onboarded && (
                <StripeConnectButton
                  organizerId={organizerId}
                  email={organizerEmail}
                  label={acc.label}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Account */}
      <div className="pt-4 border-t">
        <StripeConnectButton
          organizerId={organizerId}
          email={organizerEmail}
          isNew
        />
      </div>
    </div>
  );
}
