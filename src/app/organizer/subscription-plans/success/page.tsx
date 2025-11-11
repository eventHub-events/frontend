export default function SubscriptionSuccessPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-green-600">🎉 Payment Successful!</h1>
      <p>Your subscription has been activated successfully.</p>
      <a href="/organizer/dashboard" className="text-blue-600 underline mt-4 block">
        Go to Dashboard
      </a>
    </div>
  );
}
