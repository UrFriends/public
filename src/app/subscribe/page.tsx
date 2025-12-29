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

function StripeCheckoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push('https://buy.stripe.com/3cI5kD6Owbtcb5s05TfEk01')
      }
      className="
        inline-flex items-center justify-center
        rounded-lg px-5 py-2.5
        text-sm font-medium
        text-[#2b1a14]
        bg-[#f3dfc2]
        border border-[#d6bfa0]
        shadow-sm
        transition-all duration-200 ease-out
        hover:bg-[#edd3ae]
        hover:shadow-md
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-[#c4a484] focus:ring-offset-2
      "
    >
      Upgrade
    </button>
  );
}

function SubscriptionBlock({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);


  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-8 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
        <p className="mb-4 text-gray-600">Unlock unlimited contacts, AI tools, and more for $9/month.</p>
        <StripeCheckoutButton />
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
