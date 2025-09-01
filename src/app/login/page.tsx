"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { loginWithGoogle, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">Sign in to UrFriends!</h1>
        <p className="text-center">Google is currently the only login method</p>
        <form className="flex flex-col gap-4">
          <input
            disabled
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            disabled
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button disabled
            type="submit"
            className=" bg-gray-300 text-white rounded-lg px-4 py-2 font-semibold  transition "
          > {/* bg-blue-700 hover:bg-blue-800 hover:bg-blue-800*/}
            Sign In
          </button>
        </form>
        <div className="flex items-center gap-2 my-2">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        <div className="flex flex-col gap-3">
          <button disabled className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 font-semibold transition bg-gray-300"> {/* hover:bg-gray-50 */}
            {/* Microsoft Icon Placeholder */}
            <span className="bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-white font-bold text-xs">M</span>
            Continue with Microsoft
          </button>
          <button onClick={loginWithGoogle} className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 font-semibold hover:bg-gray-50 transition">
            {/* Google Icon Placeholder */}
            <span className="bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white font-bold text-xs">G</span>
            Continue with Google
          </button>
          <button disabled className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 font-semibold transition bg-gray-300"> {/* hover:bg-gray-50 */}
            {/* Apple Icon Placeholder */}
            <span className="bg-black rounded-full w-5 h-5 flex items-center justify-center text-white font-bold text-xs"></span>
            Continue with Apple
          </button>
        </div>
      </div>
    </main>
  );
}
