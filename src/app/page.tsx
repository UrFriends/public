"use client";

import { Provider } from "react-redux";


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

import { useDispatch } from "react-redux";

import Footer from "../components/Footer";
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import Phonebook from "../components/Phonebook";

import { store } from "./store";

import { GoogleIcon } from '@/components/icons/google-icon';
import { Loader2, LogOut } from 'lucide-react';

import { db } from '@/lib/firebase';

import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "@firebase/firestore";
import { check_if_user_has_DB } from "../../services/fireBaseServices";

import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';



import LinkBar from "@/components/LinkBar";
import { populateData } from "@/components/features/dataSlice";
import { useEffect } from "react";
import { Conversation, Person, tiersTime_Object } from "../../types/Types";
import RandomButtonBar from "../components/RandomButtonBar";
import "../index.css";

const queryClient = new QueryClient()


function LoginView() {
  const { loginWithGoogle } = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">UrFriends!</CardTitle>
          <CardDescription>Sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="outline" className="w-full" onClick={loginWithGoogle}>
            <GoogleIcon className="mr-2 h-5 w-5 fill-current" />
            Continue with Google
          </Button>

        </CardContent>
      </Card>
    </main>
  );

}

const createUserAccount = async (userID: string) => {
  try {
    const users_account_info = doc(db, "user_info", userID);
    await setDoc(users_account_info, {
      settings: {
        tiersTime: [
          { name: "1", timeFrame: "1d" },
          { name: "2", timeFrame: "3d" },
          { name: "3", timeFrame: "1d" },
          { name: "4", timeFrame: "1m" },
          { name: "5", timeFrame: "6m" }
        ]
      },
    });

    const phonebook_Builder = collection(users_account_info, "phonebook");
    await addDoc(phonebook_Builder, {
      start: "hello account"
    });

  } catch (error) {
    console.error("Error creating user account:", error);
  }
};

function DashboardView() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const queryClient = new QueryClient();

  useEffect(() => {
    const checkForNewUser = async () => {
      if (user?.uid) {
        const hasDB = await check_if_user_has_DB(user.uid);
        if (!hasDB) {
          await createUserAccount(user.uid);
          queryClient.invalidateQueries({ queryKey: ['userData', user.uid] });
        }
      }
    };
    checkForNewUser();
  }, [user, queryClient]);

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['userData', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;

      try {
        let organized_phonebook: { [key: string]: any[] } = {};

        const locate_user = doc(db, "user_info", user.uid);
        const accountData = await getDoc(locate_user);
        if (!accountData.exists()) return null;

        const phonebook = collection(locate_user, "phonebook");
        const phonebookEntriesSnap = await getDocs(phonebook);

        // seed tiers from settings
        const tierData = accountData.data()?.settings?.tiersTime;
        if (tierData) {
          tierData.forEach((t: tiersTime_Object) => {
            if (t?.name) organized_phonebook[t.name] = [];
          });
        }
        // always include "unorganized"
        if (!organized_phonebook["unorganized"]) organized_phonebook["unorganized"] = [];

        // Build an array of promises so we can await all subcollection reads
        const entryPromises = phonebookEntriesSnap.docs.map(async (entry) => {
          const data = entry.data();

          // skip the hello-world entry
          if (Object.hasOwn(data, "start")) return;

          let entryData: Person = {
            ...data,
            docID: entry.id,
            name: data.name ?? { first: "Data", last: "Error" },
            lastConvo: {}
          };

          // fetch subcollection: phonebook/{entry.id}/lastConvo
          const conversationsRef = collection(phonebook, entry.id, "lastConvo");
          const conversationsSnap = await getDocs(conversationsRef);

          const lastConvoById = Object.fromEntries(
            conversationsSnap.docs.map(d => {
              const convoData = d.data();
              // Ensure the data matches Conversation type
              return [d.id, {
                date: convoData.date ?? "",
                topic: convoData.topic ?? "",
                ...convoData
              } as Conversation];
            })
          );

          entryData = {
            ...entryData,
            lastConvo: { ...(entryData.lastConvo ?? {}), ...lastConvoById },
          };

          // decide the bucket
          const declaredTier: string | undefined = (entryData as any).tier;
          const tierKey = declaredTier && Object.hasOwn(organized_phonebook, declaredTier)
            ? declaredTier
            : "unorganized";

          // append immutably
          const prev = organized_phonebook[tierKey] ?? [];
          organized_phonebook = {
            ...organized_phonebook,
            [tierKey]: [...prev, entryData],
          };
        });

        // wait for all subcollection fetches & bucket inserts
        await Promise.all(entryPromises);

        // now everything is filled
        const final_userData = {
          settings: accountData.data().settings,
          phonebook: organized_phonebook, // structuredClone not necessary here
        };

        dispatch(populateData(final_userData));
        return final_userData;
      } catch (err) {
        console.error("ERROR: Tanstack Async Failure", err);
        throw err;
      }
    },
    enabled: !!user?.uid, // This ensures the query only runs when the user's UID is available
  });

  if (!data) {
    return (
      <>There is an error fetching the user data
        <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
          <LogOut className="h-s5 w-5" />
        </Button></>
    )
  }
  // } else {
  //   console.log("NODATA", "NODATA")
  // }

  // if (isPending) {
  //   console.log(isPending, "data55")
  // } else {
  //   console.log("PEND", "PEND")
  // }

  // if (error) {
  //   console.log(error.message, "data55")
  // } else {
  //   console.log("ERROR", "ERROR")
  // }

  // if (isFetching) {
  //   console.log(isFetching.valueOf(), "data55")
  // } else {
  //   console.log("FETCH", "FETCH")
  // }



  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-foreground">
          UrFriends! Hello, {user?.displayName || 'User'}
        </h1>
        <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
          <LogOut className="h-s5 w-5" />
        </Button>
      </header>
      <main className="">
        <Notification />
        <Modal user={user} data={data} />
        <RandomButtonBar />
        <p></p>
        <LinkBar />
        <Phonebook data={data} />
        <Footer />

      </main>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        Loading
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }


  return user ?
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <DashboardView />
      </Provider>
    </QueryClientProvider>
    : <LoginView />;
}
