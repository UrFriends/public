import { sendNotification } from "@/hooks/sendNotification";
import { db } from "@/lib/firebase";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch
} from "@firebase/firestore";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { Conversation, Person, tiersTime_Object } from "../types/Types";

export const check_if_user_has_DB = async (arg1: string | undefined) => {
  if (typeof arg1 == "string") {
    try {
      const users_account_info = doc(db, "user_info", arg1);
      const userAccount = await getDoc(users_account_info);
      if (userAccount.exists()) {
        //the user has an account
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error("Error searching for user data: ", e);
      return false;
    }
  }
  return false;
};

// Conversation services
export const add_Conversation = async (UserID: string, person: Person, conversation: Conversation, dispatch: Dispatch<UnknownAction>
) => {
  if (person) {
    try {
      const users_account_info = doc(db, "user_info", UserID);
      const phonebookRef = collection(users_account_info, "phonebook");
      const contactRef = doc(phonebookRef, person.docID);
      const lastConvoRef = collection(contactRef, "lastConvo");
      // Check to see if we are deleting the original placeholder null conversation
      // OR if user created conversation(s) are already present
      if (person && conversation) {
        await addDoc(lastConvoRef, conversation).then(() => {
          sendNotification(dispatch, { type: "green", message: "The conversation was successfully added" })
        }).catch((error) => {
          console.log(error, "ERROR add_Conversation: There was an error adding the document")
          sendNotification(dispatch, { type: "red", message: "ERROR add_Conversation: There was an error adding the document" })
        })
      } else {
        sendNotification(dispatch, { type: "red", message: "ERROR add_Conversation: The data was improperly formatted" })
      }
    } catch (e) {
      console.error("ERROR add_Conversation: adding document: ", e);
      sendNotification(dispatch, { type: "red", message: "ERROR add_Conversation: There was an error locating your user information" })
    }
  }
};

export const changeProperty_Conversation = async (
  UserID: string,
  person: Person,
  conversation: Conversation,
  dispatch: Dispatch<UnknownAction>
) => {
  //change a given property on a contact
    try {
      const users_account_info = doc(db, "user_info", UserID);
      const phonebookRef = collection(users_account_info, "phonebook");
      const contactRef = doc(phonebookRef, person.docID);
      const lastConvoRef = collection(contactRef, "lastConvo");
      const conversationRef = doc(lastConvoRef, conversation.DocID)

      const changeProperty = async () => {
        try {
          await updateDoc(conversationRef, {
            topic: conversation.topic,
            date: conversation.date
          })
          sendNotification(dispatch, { message: "Conversation property change successful", type: "green" })
        } catch (err) {
          console.error(err, "ERROR fireBaseServices changeProperty_Conversation: failed to change property");
          sendNotification(dispatch, { message: "ERROR fireBaseServices changeProperty_Conversation: failed to change property", type: "red" })
        }
      };
      changeProperty();


    } catch (error) {
      console.log(error, "ERROR fireBaseServices changeProperty_Conversation: firebase failure")

    }

};

export const delete_Conversation = async (UserID: string, person: Person, conversation_ID: string, dispatch: Dispatch<UnknownAction>) => {
  //delete a conversation
  try {
    const users_account_info = doc(db, "user_info", UserID);
    const phonebookRef = collection(users_account_info, "phonebook");
    const contactRef = doc(phonebookRef, person.docID);
    const lastConvoRef = collection(contactRef, "lastConvo");
    const conversationRef = doc(lastConvoRef, conversation_ID)

    const performDelete = async () => {
      try {
        await deleteDoc(conversationRef).then(() => {
          //indicate success
          sendNotification(dispatch, { message: "Conversation successfully deleted", type: "green" })
        }).catch((error) => {
          console.log(error, "ERROR firebaseServices delete_Conversation: deleting conversation")
          sendNotification(dispatch, { message: "ERROR firebaseServices delete_Conversation: conversation deletion failed", type: "red" })
        });
      } catch (err) {
        console.error(err);
        sendNotification(dispatch, { message: "ERROR firebaseServices delete_Conversation: conversation deletion failed", type: "red" })
      }
    };
    performDelete();
  } catch (error) {
    console.log(error,)
    sendNotification(dispatch, { message: "ERROR firebaseServices delete_Conversation: firebase failure", type: "red" })
  }
};
// (close) Conversation services

// Contact services
export const add_Contact = async (UserID: string, person: Person) => {
  //add a contact to someone's phonebook
  try {
    const users_account_info = doc(db, "user_info", UserID);
    const phonebookRef = collection(users_account_info, "phonebook");
    const add_Document = await addDoc(phonebookRef, person);

    if (add_Document) {
      //reload page
      location.reload();
      return true;
    } else {
      console.log("ERROR: add_Contact firebaseServices Adding document");
      return false;
    }
  } catch {
    console.log("ERROR: add_Contact firebaseServices");
    return false;
  }
};

export const changeProperty_Contact = async (
  UserID: string,
  changeQualifier: string,
  propertyToChange: string,
  change: string | number | readonly string[]
) => {
  //change a contact's properties
  //changeQualifier is the phonebook entr
  // y's phonebook document ID
  const changeContact = async () => {
    try {
      const contactToChangeRef = doc(db, "user_info", UserID, "phonebook", changeQualifier);
      if (propertyToChange == "first name") {
        //first name is a nested property in the name property
        await updateDoc(contactToChangeRef, {
          "name.first": change
        })
      } else if (propertyToChange == "last name") {
        //last name is a nested property in the name property
        await updateDoc(contactToChangeRef, {
          "name.last": change
        })
      } else {
        await updateDoc(contactToChangeRef, {
          [propertyToChange]: change
        })
      }
    } catch (err) {
      console.error("ERROR changeProperty_Contact: changing a contact property in fireBaseServices", err);
    }
  };
  changeContact();
  return true;
};

export const delete_Contact = async (UserID: string, contact_docID: string, dispatch: Dispatch<UnknownAction>) => {
  //delete a contact
  try {
    const contactToDelete = doc(db, "user_info", UserID, "phonebook", contact_docID);
    const performDelete = async () => {
      try {
        console.log("TODO: add Document ID for the subcollection of LastConvo")
        // the lastConvo subcollection will need to have each document individually deleted
        await deleteDoc(contactToDelete).then(() => {
          location.reload();
        });
      } catch (error) {
        console.log("ERROR delete_Contact performDelete failure to delete Contact")
        sendNotification(dispatch, { type: "red", message: "Error deleting the contact" })
      }
    }
    performDelete();
    sendNotification(dispatch, { type: "green", message: "Contact successfully deleted" })
  } catch (error) {
    console.log("ERROR delete_Contact service error ")
    sendNotification(dispatch, { type: "red", message: "Error deleting the contact" })
  }
};
// (close) Contact services

// Tier services
export const add_Tier = async (
  UserID: string,
  tierName: string,
  dispatch: Dispatch<UnknownAction>) => {

  if (tierName == "") {
    sendNotification(dispatch, { type: "red", message: "A tier name cannot be empty" })
    return false;
  } else {
    add_Tier
    const perform_AddTier = async () => {
      try {
        const users_account_info = doc(db, "user_info", UserID);
        const userData = await getDoc(users_account_info);
        if (userData.data()) {
          let setting_Data = {
            ...userData.data(),
          }

          //Validate that this name is unused
          let unused_tier = true;
          let newTiers_Data = [];
          setting_Data.settings.tiersTime.forEach((tierObj: tiersTime_Object) => {
            console.log(tierObj, "tierObj");
            if (tierObj.name == tierName) {
              //then this name is already in use in the settings, and shouldn't be repeated
              unused_tier = false;
            } else {
              // assemble the new user's tier settings
              newTiers_Data.push(tierObj);
            }
          })
          if (unused_tier) {
            //add the new tier
            newTiers_Data.push({ name: tierName, timeFrame: "u" })

            //UPDATE THE SETTINGS
            await updateDoc(users_account_info, {
              settings: {
                tiersTime: newTiers_Data
              }
            }).catch((error) => {
              console.log("ERROR add_Tier firebaseServices: ", error)
              sendNotification(dispatch, { type: "red", message: "Error updating user's tier settings" })
              return false;
            })
            sendNotification(dispatch, { type: "green", message: "Successfully added tier" })
            return true;
          } else {
            // send a bad notification and throw an error
            sendNotification(dispatch, { type: "red", message: "Error, this tier name is in use" })
            console.log("ERROR add_Tier firebaseServices: Tier already used ")
            return false;
          }
        }
      } catch (err) {
        console.error("ERROR add_Tier: adding Tier fireBaseServices", err);
        return false;
      }
    };
    perform_AddTier();
    return true;
  }
};

export const changeProperty_Tier = async (
  UserID: string,
  tierNameToChange: string | number | readonly string[] | undefined,
  propertyToChange: string | number | readonly string[],
  change: string | number | readonly string[]
) => {
  const change_Tier = async () => {
    try {
      const users_account_info = doc(db, "user_info", UserID);
      const userData = await getDoc(users_account_info);
      if (userData.data()) {
        let newTiers_Data = {
          ...userData.data(),
        }
        // sort the old data and replace the former tiersTime setting with new one
        if (Object.hasOwn(newTiers_Data, "settings") && Object.hasOwn(newTiers_Data.settings, "tiersTime")) {
          let newTiers = newTiers_Data.settings.tiersTime.map((tier: tiersTime_Object) => {
            if (tier.name == tierNameToChange) {
              if (propertyToChange == "timeFrame") {
                return { ...tier, timeFrame: change }
              }
              if (propertyToChange == "name") {
                return { ...tier, name: change }
              }
            } else {
              return tier
            }
          });

          //UPDATE THE SETTINGS
          await updateDoc(users_account_info, {
            settings: {
              tiersTime: newTiers
            }
          }).then(() => {
            //UPDATE ANY CONTACT WITH THE FORMER TIER NAME
            if (propertyToChange === 'name') {
              const update_Phonebook = async () => {
                try {
                  const phonebookRef = collection(users_account_info, "phonebook");
                  const querySnapshot = await getDocs(phonebookRef);
                  const batch = writeBatch(db);
                  querySnapshot.forEach((doc) => {
                    const contact = doc.data();
                    if (contact.tier === tierNameToChange) {
                      const docRef = doc.ref;
                      batch.update(docRef, { tier: change });
                    }
                  });
                  await batch.commit();
                } catch (err) {
                  console.error("ERROR changeProperty_Tier: updating the phonbebook", err);
                }
              };
              update_Phonebook();
            }
            return true;
          }).catch((error) => {
            console.log("ERROR changeProperty_Tier firebaseServices: ", error)
            return false;
          })
        }
      }
    } catch (err) {
      console.error("ERROR change_timeFrame: changing timeFrame in fireBaseServices", err);
    }
  };
  change_Tier();
  return true;
}

export const delete_Tier = async (UserID: string, tierName: string, dispatch: Dispatch<UnknownAction>) => {
  try {
    const users_account_info = doc(db, "user_info", UserID);
    const userData = await getDoc(users_account_info);
    if (userData.data()) {
      const data = userData.data();

      if (data && Object.hasOwn(data, "settings") && Object.hasOwn(data.settings, "tiersTime")) {
        let newTiers_Data: tiersTime_Object[] = [];

        if (Array.isArray(data.settings.tiersTime)) {
          data.settings.tiersTime.forEach((element: tiersTime_Object) => {
            if (element.name == tierName) {
              //this tier is being removed from the settings
            } else {
              newTiers_Data.push(element);
            }
          })
          const performDelete = async () => {
            try {
              await updateDoc(users_account_info, {
                settings: {
                  tiersTime: newTiers_Data
                }
              })
              sendNotification(dispatch, { type: "green", message: "Successfully deleted tier" })

              setTimeout(() => {
                location.reload();
              }, 1200)

            } catch (err) {
              console.error("ERROR delete_Tier fireBaseServices: ", err);
            }
          };
          performDelete();
        }
      }
    }
  } catch (error) {

  }
};
// (close) Tier services
