"use client"

import { HeaderComponent } from "@/app/page";
import { BackArrowIcon } from "@/components/icons/back-arrow-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth"; // Adjust path if needed
import { loadStripe } from "@stripe/stripe-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";

const stripePromise = loadStripe("pk_live_DgCt9ErbMG0BTGdvybP8Psim00Ru4euPq6"); // Use your publishable key

function SubscriptionBlock({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const priceId = "price_12345"; // Replace with your Stripe Price ID
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, priceId }),
    });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
    setLoading(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-8 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
        <p className="mb-4 text-gray-600">Unlock unlimited contacts, AI tools, and more for $9/month.</p>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Subscribe with Stripe"}
        </button>
      </div></>
  );
}

export default function SubscribePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Please log in to subscribe.</p>
      </div>
    );
  }

  return (
    <>
      <HeaderComponent logout={logout} displayName={user.displayName} />
      <ReturnHomeButton router={router} />
      <SubscriptionBlock user={user} /></>);
}


interface ReturnHomeButton__Props {
  router: AppRouterInstance
}

export const ReturnHomeButton = (props: ReturnHomeButton__Props) => {
  return (
    <div className="flex content-center justify-center">
      <Button onClick={() => props.router.push("/")}>

        <BackArrowIcon />
        <HomeIcon />
        <p>Home</p>

      </Button>
    </div>
  )
}
