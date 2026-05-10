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

  const url = process.env.NEXT_PUBLIC_CREATE_USER_ACCT_PROXY_URL;

  console.log("CREATE USER PROXY URL:", url);

  if (!url) {
    throw new Error("NEXT_PUBLIC_CREATE_USER_ACCT_PROXY_URL is missing.");
  }

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };

  console.log("The request options are:", requestOptions);

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `create-user-acct-proxy failed: ${response.status} ${text}`
    );
  }
}
