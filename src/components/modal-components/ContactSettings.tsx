import { Button } from "@/components/ui/button";
import { sendNotification } from "@/hooks/sendNotification";
import { useAppSelector } from "@/hooks/use-app-selector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changeProperty_Contact, delete_Contact } from "../../../services/fireBaseServices";
import { ContactSettings__Props, Person } from "../../../types/Types";
import { ChangeableInput } from "../ChangeableInput";


const ContactSettings = (props: ContactSettings__Props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const person = useAppSelector((state) => state.modal.person) as Person | null;
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const changePersonMutation = useMutation({
    mutationFn: async (variables: { changeQualifier: string | number, keyToChange: string | number, change: string | number }) => {
      // changeQualifier is the phonebook entry's phonebook document ID
      if (person && person.docID && variables.changeQualifier && variables.keyToChange && variables.change
        && typeof variables.changeQualifier == "string" && typeof variables.keyToChange == "string"
      ) {
        await changeProperty_Contact(props.user?.uid, person.docID, variables.keyToChange, variables.change);
        return true;
      } else {
        sendNotification(dispatch, { message: "Attempting to submit improperly formatted data", type: "red" });
        throw new Error('ERROR ContactSettings changePersonMutation: Variables are not properly configured as strings');
      }
    },
    onSuccess: (data, variables, context) => {
      sendNotification(dispatch, { message: "Property successfully changed!", type: "green" });
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
    onError: (error) => {
      sendNotification(dispatch, { message: "failure to change contact property", type: "red" });
      console.log("Error", error)
    }
  })

  return (

    <>
      {person && <>

        <h2>Contact Settings</h2>

        <p>First Name: </p>
        <ChangeableInput mutation={changePersonMutation} valueProp={person.name.first} valueSwitch={"first name"} />
        <p>Last Name: </p>
        <ChangeableInput mutation={changePersonMutation} valueProp={person.name.last} valueSwitch={"last name"} />
        {person.email && typeof person.email == "string" && <>
          <p>Email: </p>
          <ChangeableInput mutation={changePersonMutation} valueProp={person.email} valueSwitch={"email"} />
        </>
        }
        {person.phoneNumber && typeof person.phoneNumber == "string" && <>
          <p>Phone Number: </p>
          <ChangeableInput mutation={changePersonMutation} valueProp={person.phoneNumber} valueSwitch={"phoneNumber"} /></>
        }
      </>
      }
      {person && person.docID && <div className="p-2">
        {!showConfirm && <Button variant="destructive" onClick={() => setShowConfirm(true)}>
          Delete {person?.name.first}
        </Button>}
        {showConfirm && <Button variant="destructive" disabled onClick={() => setShowConfirm(true)}>
          Delete {person?.name.first}
        </Button>}
        {showConfirm && person && person.docID &&
          <div className="mt-2">
            <p>
              You are about to delete all information and conversations for {person?.name.first}
            </p>
            <Button variant="destructive" onClick={() => {
              if (props.user?.uid && person?.docID) {
                delete_Contact(props.user.uid, person.docID, dispatch);
              } else {
                sendNotification(dispatch, { message: "User ID or Contact ID missing", type: "red" });
              }
            }}>
              I'm Sure
            </Button>
            <Button variant="outline" onClick={() => { setShowConfirm(false) }}>
              Nevermind
            </Button>
          </div>
        }
      </div>}
    </>
  );
};

export default ContactSettings;
