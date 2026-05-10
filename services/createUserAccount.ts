// services/createUserAccount.ts
import { getAuth } from "@firebase/auth";

/**
 * Calls the Firebase Function proxy to create a user account.
 * The Firebase Function handles authentication and Cloud Run.
 */
export async function createUserAccount(): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User must be authenticated to create an account.");
  }

  const idToken = await user.getIdToken(true);

  const body = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }

  console.log("The body is: ", body)

  const url = (import.meta as any).env?.NEXT_PUBLIC_CREATE_USER_ACCT_PROXY_URL;
  const response = await fetch(url, body);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `create-user-acct-proxy failed: ${response.status} ${text}`
    );
  }
}
