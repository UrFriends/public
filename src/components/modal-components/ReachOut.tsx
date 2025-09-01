import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/use-app-selector";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { add_Conversation } from "../../../services/fireBaseServices";
import { ReachOut__Props } from "../../../types/Types";
import { sendNotification } from "../../hooks/sendNotification";


const ReachOut = (props: ReachOut__Props) => {
  const person = useAppSelector((state) => state.modal.person);
  const [conversationDate, setConversationDate] = useState("");

  const dispatch = useDispatch();


  const submitNewConversation = async (event: FormEvent<HTMLFormElement>) => {
    if (props.user && person) {
      event.preventDefault();

      const form = event.target as HTMLFormElement;
      const date = new Date(form.date.value);
      //if this is an invalid date, then generate an error
      if (isNaN(date.getTime())) {
        sendNotification(dispatch, { message: "the date is invalid", type: "red" })
        return null;
      }

      //TODO: fix this bug; date/time parsing is trouble currently
      //converts date to UTC String
      console.log("TODO: fix this bug; date/time parsing is trouble currently")
      var calendarDate = new Date(
        new Date(date).getTime() + 60 * 60 * 1000
      ).toUTCString();

      const topic = form.conversation.value;

      const newConvo = {
        topic: topic,
        date: calendarDate
      }

      try {
        await add_Conversation(props.user.uid, person, newConvo, dispatch).then(() => {
          sendNotification(dispatch, { message: "Conversation successfully added", type: "green" })
        });
      } catch (error) {
        console.log(error, "ERROR ReachOut: There was an error adding the conversation")
        sendNotification(dispatch, { message: "Conversation addition failed", type: "red" })
      }
    } else {
      console.log("ERROR ReachOut: User data or person improperly formatted")
      sendNotification(dispatch, { message: "User data or person improperly formatted", type: "red" })
    }
  };

  //render

  return (
    <>
      <form onSubmit={(event) => submitNewConversation(event)}>
        <input
          onChange={(event) => setConversationDate(event.target.value)}
          value={conversationDate}
          type="date"
          name="date"
        ></input>
        <br />
        <textarea
          // rows="15"
          style={{ width: "100%", resize: "none", overflow: "hidden" }}
          name="conversation"
        ></textarea>
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

export default ReachOut;
