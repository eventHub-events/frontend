export default function SubscriptionCancelPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Canceled</h1>
      <p>You canceled the subscription process. No money was charged.</p>
      <a href="/organizer/subscription" className="text-blue-600 underline mt-4 block">
        Try Again
      </a>
    </div>
  );
}
