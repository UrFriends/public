import { Button } from "@/components/ui/button";
import { sendNotification } from "@/hooks/sendNotification";
import { useAppSelector } from "@/hooks/use-app-selector";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changeProperty_Conversation, delete_Conversation } from "../../../services/fireBaseServices";
import { Person } from "../../../types/Types";
import {
  clearUnsavedChanges,
  setUnsavedChanges,
} from "../features/modalSlice";

const ConversationDetails = (props: any) => {
  const unsavedChanges = useAppSelector((state) => state.modal.unsavedChanges);
  const person: Person = useAppSelector((state) => state.modal.person);
  const conversation = useAppSelector((state) => state.modal.topic) as { topic: string; date?: string; docID?: string; DocID?: string } | null;

  const [unsavedConversation, setUnsavedConversation] = useState(
    conversation ? conversation.topic : ""
  );
  const [unsavedDate, setUnsavedDate] = useState(
    conversation ? conversation.date : "01/01/01"
  )
  const [editConvo, setEditConvo] = useState(false);
  const [editDate, setEditDate] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();

  //show edit box to change convo
  const handleToggleEditConvo = () => {
    setEditConvo(!editConvo);
  };

  //if changes are made to the coversation, they are saved locally;
  //if changes are made, a dispatch is made to set a bool in the store to indicate unsaved changes, preventing premature modal closure
  const changeConversation = (event: any) => {
    //if unsaved changes exist
    if (event.target.value == ((conversation && conversation.topic) ? conversation.topic : "")) {
      //this condition is met if the changes to the conversation are the same as the original conversation; clear bool record of unsaved changes
      dispatch(clearUnsavedChanges([]));
    } else {
      dispatch(setUnsavedChanges([]));
    }
    //unsaved changes are stored in this component in state.
    setUnsavedConversation(event.target.value);
  };

  //cancel changing the conversation, throw away changes, reset state.
  const cancelChangeConversaton = () => {
    setEditConvo(!editConvo);
    setUnsavedConversation((conversation && conversation.topic) ? conversation.topic : "");
    dispatch(clearUnsavedChanges([]));
  };

  //sends update to server, notifies of success/failure
  const saveConversation = async () => {
    //ensure that changes have taken place
    if (
      conversation &&
      !(unsavedConversation == conversation.topic && unsavedDate == conversation.date)
    ) {
      const updatedConversation = {
        topic: unsavedConversation,
        date: unsavedDate !== undefined ? unsavedDate : null,
        DocID: conversation.DocID
      }
      try {
        if (conversation) {
          await changeProperty_Conversation(
            props.user.uid,
            person,
            updatedConversation,
            dispatch
          )
        }
      } catch (error) {
        console.log(error,)
        sendNotification(dispatch, { message: "ERROR ConversationDetails saveConversation: failed to change property", type: "red" })
      }
    } else {
      sendNotification(dispatch, { message: "There are no changes to the conversation", type: "red" })
    }
  };

  if (!person) {
    return null;
  }

  return (
    <div>
      Conversation Details
      {unsavedChanges && <p>There are unsaved Changes</p>}
      <br />
      {editConvo && (
        <textarea
          style={{ width: "100%", resize: "none", overflow: "hidden" }}
          onChange={(event) => {
            changeConversation(event);
          }}
          value={unsavedConversation}
        ></textarea>
      )}
      <div className="conv-details-conv-render">{(conversation && conversation.topic) ? conversation.topic : ""}</div>
      <div className="conv-details-conv-render">{(conversation && conversation.date) ? conversation.date : ""}</div>
      {!editConvo && (
        <Button onClick={handleToggleEditConvo}>Edit Conversation</Button>
      )}
      {editConvo && (
        <>
          <Button onClick={saveConversation}>Save</Button>
          <br />
          <Button onClick={cancelChangeConversaton}>Cancel</Button>
        </>
      )}
      {!showConfirm && <>
        <Button variant="destructive" onClick={() => {
          setShowConfirm(true)
        }}>
          Delete This Conversation
        </Button>
      </>}
      {showConfirm && person && person.docID &&
        <div className="mt-2">
          <p>
            You are attempting to delete this conversation
          </p>
          <Button variant="destructive" onClick={() => {
            if (props.user?.uid && person?.docID) {
              const callService = async () => {
                try {
                  await delete_Conversation(props.user.uid, person, (conversation && conversation.DocID) ? conversation.DocID : "", dispatch)
                } catch (err) {
                  console.error(err);
                  sendNotification(dispatch, { message: "ERROR ConversationDetails: calling service to delete conversation", type: "red" })
                }
              };
              callService();
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

    </div>
  );
};

export default ConversationDetails;
