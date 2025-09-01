import { useDispatch } from "react-redux";
import { RecentConversations__Props } from "../../types/Types";
import { getDateFromDateTime } from "../hooks/getDateFromDateTime";
import { shortenConversation } from "../hooks/shortenConversation";
import { setVisibleModal } from "./features/modalSlice";

//Essentially a fancy ul component
const ConversationList = (props: any) => {
  return (
    <>
      <div className="conversation-list">
        <h4 style={{ textAlign: "center" }}>Recent Conversations</h4>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          {props.children}
        </ul>
      </div>
    </>
  );
};

//Essentially a fancy li component
const ConversationButton = (props: any) => {
  if (props) {
    console.log(props, "props on conversationbutton")
  }


  return (
    <li>
      <div className="conv-btn-container">
        <button
          className="conv-btn"
          style={{}}
          onClick={() => props.handleOpenExpandedContactModal("conversation", props.conversation)}
        >
          <span className="conv-btn-date-span">
            {Object.keys(props.person.lastConvo).length === 0
              ? null
              : getDateFromDateTime(props.conversation.date)}
          </span>
          <span className="conv-btn-conv-span">
            - {shortenConversation(props.conversation.topic, 40)}
          </span>
        </button>
      </div>
    </li>
  );
};

//Renders ul with li's but conditionally. If there are many conversations, an
//abbreviated list and an expand button are rendered.
const RecentConversations = (props: RecentConversations__Props) => {
  const dispatch = useDispatch();
  const handleOpenExpandedContactModal = (modalContentType: any, topic: any) => {
    dispatch(setVisibleModal({ modalContentType, topic: topic, person: props.person }));
  };

  //If !props.conversationArray, then data is still being fetched, or there is no data.
  //Under default circumstances, if a contact has no conversations, lastConvo[0].date will be null
  if (!props.conversationArray || (Array.isArray(props.conversationArray) && props.conversationArray.length === 0)) {
    return null;
  } else if (Array.isArray(props.conversationArray) && props.conversationArray.length > 5) {
    //If the length is greater than 5, return abbreviated list with option to expand
    return (
      <>
        <ConversationList>
          {" "}
          {props.conversationArray
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((conversation: any) => {
              return (
                <ConversationButton
                  key={`${conversation.date}+${conversation.topic}`}
                  conversation={conversation}
                  person={props.person}
                  handleOpenExpandedContactModal={
                    handleOpenExpandedContactModal
                  }
                />
              );
            })}
          <div className="more-conv-btn">
            <button onClick={() => handleOpenExpandedContactModal("Expand", [])}>
              more conversations
            </button>
          </div>
        </ConversationList>
      </>
    );
  } else {
    //return the list, no need for abbreviating the props.conversationArray
    return (
      <>
        <ConversationList>
          {props.conversationArray
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((conversation: any) => {
              return (
                <ConversationButton
                  key={`${conversation.date}+${conversation.topic}`}
                  conversation={conversation}
                  person={props.person}
                  handleOpenExpandedContactModal={
                    handleOpenExpandedContactModal
                  }
                />
              );
            })}
        </ConversationList>
      </>
    );
  }
};

export default RecentConversations;
