import { getFunctions, httpsCallable } from "@firebase/functions";

export const functions = getFunctions();

export const contacts_service = httpsCallable(functions, "contacts_service");

