import { getFunctions, httpsCallable } from "@firebase/functions";

export const functions = getFunctions();

export const test = httpsCallable(functions, "contacts_service");
