"use client";

import { Button } from "@/components/ui/button";
import { stripeOnboardingService } from "@/services/organizer/stripeOnboarding";
import { showError } from "@/utils/toastService";
import { AxiosError } from "axios";
import { useState } from "react";

interface StripeConnectButtonProps {
  organizerId: string;
  email: string;
  accountId?: string;
  label?: string;
  isNew?: boolean;
}

export default function StripeConnectButton({
  organizerId,
  email,
  accountId,
  label,
  isNew = false,
}: StripeConnectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [accountLabel, setAccountLabel] = useState(label || "");

  const handleStripeConnect = async () => {
    if (isNew && !accountLabel.trim()) {
      showError("Please enter a label for this payout account");
      return;
    }

    try {
      setLoading(true);

      const res = await stripeOnboardingService.stripeOnboard({
        organizerId,
        email,
        accountId,
        label: accountLabel,
      });

      const url = res.data.data.onBoardingUrl;
      if (url) window.location.href = url;
    } catch (err) {
      if (err instanceof AxiosError) {
        showError(err.response?.data?.message || "Stripe onboarding failed");
      } else {
        showError("Stripe onboarding failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {isNew && (
        <input
          type="text"
          placeholder="e.g. Primary Bank / Events Account"
          value={accountLabel}
          onChange={(e) => setAccountLabel(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
        />
      )}

      <Button
        onClick={handleStripeConnect}
        disabled={loading}
        className={`w-full ${
          isNew
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading
          ? "Connecting..."
          : isNew
          ? "Add Stripe Account"
          : "Complete Stripe Setup"}
      </Button>
    </div>
  );
}
