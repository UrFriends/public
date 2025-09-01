import { useAppSelector } from "@/hooks/use-app-selector";
import React, { useState } from "react";

type Conversation = {
  date: string | null;
  topic: string;
};

type Person = {
  lastConvo: Conversation[];
  // add other properties as needed
};

const AddConversationSelectContact = (props: any) => {
  console.log("TODO: fix AddConversationSelectContact")
  const person = useAppSelector((state) => state.modal.person) as Person | null;

  // Ensure person.lastConvo is always an array
  const lastConvo = person?.lastConvo ?? [];
  const [spokeFormVisible, setSpokeFormVisible] = useState(true);

  const [conversationDate, setConversationDate] = useState("");

  // const dispatch = useDispatch();

  const submitNewConversation = (event: any) => {
    event.preventDefault();

    const date = new Date(event.target.date.value);

    if (isNaN(date.getTime())) {
      // sendNotification.sendNotification(dispatch, { message: "the date is invalid", type: "red" });
      return null;
    }

    var calendarDate = new Date(
      new Date(date).getTime() + 60 * 60 * 1000
    ).toUTCString();
    let newConversations = [];


    if (!person || lastConvo.length === 0 || lastConvo[0].date === null) {
      newConversations = [
        {
          date: calendarDate,
          topic: "TODO: fix topic variable",
        },
      ];
    } else {
      newConversations = lastConvo.concat({
        date: calendarDate,
        topic: "TODO: fix topic variable",
      });
    }
    const personToUpdate = {
      // ...person,
      lastConvo: newConversations,
    };

    // patchConversation(personToUpdate);

    //reset the state and visibility of the conversation form
    setSpokeFormVisible(false);
    setConversationDate("");
  }



  //render
  return (
    <>
      Person: <br />
      <input></input>
      <br />
      <div className="add-convo-search-results">
        <button className="ac-sr-button">Search Results</button>
        <button className="ac-sr-button">Search Results</button>
        <button className="ac-sr-button">Search Results</button>
        <button className="ac-sr-button">Search Results</button>
        <button className="ac-sr-button">Search Results</button>
      </div>
      <>
        {" "}
        <form onSubmit={(event) => submitNewConversation(event)}>
          <textarea
            // rows="15"
            style={{ width: "100%", resize: "none", whiteSpace: "pre" }}
            name="conversation"
          ></textarea>
          <input
            onChange={(event) => setConversationDate(event.target.value)}
            value={conversationDate}
            type="date"
            name="date"
          ></input>
          <br />
          <button type="submit">Submit</button>
        </form>
      </>
    </>
  );


};




export default AddConversationSelectContact;
