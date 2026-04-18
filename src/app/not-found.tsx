"use client"

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button
        onClick={() => router.push("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        Go to Home
      </button>
    </div>
  );
}
