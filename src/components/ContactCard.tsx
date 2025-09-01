import { useState } from "react";
import { useDispatch } from "react-redux";


import { GearWheelIcon } from "@/components/icons/gearWheel-icon";
import { PersonIcon } from "@/components/icons/person-icon";
import RecentConversations from "@/components/RecentConversations";
import { getDateFromDateTime } from "@/hooks/getDateFromDateTime";
import { ContactCard__Props } from "../../types/Types";
import { setVisibleModal } from "./features/modalSlice";

const MiniIconWrapper = (props: any) => {
  return (
    <div className="w-8">
      {props.children}
    </div>
  )
}

//static; icon passed to ActionButton as props
const ContactSettingsIcon = () => {
  return (
    <>
      <PersonIcon />
      <GearWheelIcon />
    </>
  );
};
//static; icon passed to ActionButton as props
const ConversationStartersIcon = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    {/* <!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
    <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" /></svg>
};
//static; icon passed to ActionButton as props
const ReachOutIcon = () => {
  return (
    <>
      <MiniIconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          {/* <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
          <path d="M64 416L64 192C64 139 107 96 160 96L480 96C533 96 576 139 576 192L576 416C576 469 533 512 480 512L360 512C354.8 512 349.8 513.7 345.6 516.8L230.4 603.2C226.2 606.3 221.2 608 216 608C202.7 608 192 597.3 192 584L192 512L160 512C107 512 64 469 64 416z" /></svg>
      </MiniIconWrapper>

      <MiniIconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" /></svg>
      </MiniIconWrapper>
    </>
  );
};
//static; icon passed to ActionButton as props
const ScheduleIcon = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-contact-round-icon lucide-contact-round"><path d="M16 2v2" /><path d="M17.915 22a6 6 0 0 0-12 0" /><path d="M8 2v2" /><circle cx="12" cy="12" r="4" /><rect x="3" y="4" width="18" height="18" rx="2" /></svg>
};

//static; icon passed to ActionButton as props
const ScheduleIcon_2 = () => {
  return (<MiniIconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
      {/* <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
      <path d="M224 64C241.7 64 256 78.3 256 96L256 128L384 128L384 96C384 78.3 398.3 64 416 64C433.7 64 448 78.3 448 96L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 96C192 78.3 206.3 64 224 64zM160 304L160 336C160 344.8 167.2 352 176 352L208 352C216.8 352 224 344.8 224 336L224 304C224 295.2 216.8 288 208 288L176 288C167.2 288 160 295.2 160 304zM288 304L288 336C288 344.8 295.2 352 304 352L336 352C344.8 352 352 344.8 352 336L352 304C352 295.2 344.8 288 336 288L304 288C295.2 288 288 295.2 288 304zM432 288C423.2 288 416 295.2 416 304L416 336C416 344.8 423.2 352 432 352L464 352C472.8 352 480 344.8 480 336L480 304C480 295.2 472.8 288 464 288L432 288zM160 432L160 464C160 472.8 167.2 480 176 480L208 480C216.8 480 224 472.8 224 464L224 432C224 423.2 216.8 416 208 416L176 416C167.2 416 160 423.2 160 432zM304 416C295.2 416 288 423.2 288 432L288 464C288 472.8 295.2 480 304 480L336 480C344.8 480 352 472.8 352 464L352 432C352 423.2 344.8 416 336 416L304 416zM416 432L416 464C416 472.8 423.2 480 432 480L464 480C472.8 480 480 472.8 480 464L480 432C480 423.2 472.8 416 464 416L432 416C423.2 416 416 423.2 416 432z" /></svg>
  </MiniIconWrapper>)
};


//static
const ActionButton = (props: any) => {
  return (
    <>
      <button
        onClick={(event) =>
          props.handleModalOpen(event, {
            modalContentType: props.message,
            person: props.person,
          })
        }
        className="action-button flex flex-row p-2"
      >
        <div className=" rounded-full w-20 h-16 flex items-center justify-center">
          <MiniIconWrapper>{props.icon}</MiniIconWrapper>
        </div>
        <div className="action-button-text w-full flex items-center">
          <p className="w-full">{props.children}
          </p>
        </div>
      </button>
    </>
  );
};

//static; shows if user has reached out to contact within Tier's timeframe
const ContactStatusIndicator = (props: any) => {
  const date1 = new Date(props.windowOfLastContact);
  const date2 = new Date(props.lastContact);

  //if contact has no conversations, or their latest conversation
  //is outside of the tier's timeframe
  if (
    props.windowOfLastContact === null ||
    props.lastContact === null ||
    date1 > date2 || (props.windowOfLastContact == "NaN/NaN/NaN" || props.lastContact == "")
  ) {
    return (
      <>
        <svg fill="red" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          {/* <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
          <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
      </>
    );
  }

  //if latest conversation is within the tier's timeframe
  if (date1 < date2) {
    return (
      <>
        <svg fill="green" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          {/* <!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
          <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM404.4 276.7L324.4 404.7C320.2 411.4 313 415.6 305.1 416C297.2 416.4 289.6 412.8 284.9 406.4L236.9 342.4C228.9 331.8 231.1 316.8 241.7 308.8C252.3 300.8 267.3 303 275.3 313.6L302.3 349.6L363.7 251.3C370.7 240.1 385.5 236.6 396.8 243.7C408.1 250.8 411.5 265.5 404.4 276.8z" /></svg>
      </>
    );
  }
};


//export; displays contact's info, conversations, and action buttons
function ContactCard(props: ContactCard__Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const dispatch = useDispatch();

  //expands ContactCard.tsx
  const handleExpand = (event: any) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  //opens modal for the various components within expanded ContactCard.tsx
  const handleModalOpen = (event: any, payload: any) => {
    event.stopPropagation();
    dispatch(setVisibleModal(payload));
  };

  if (isExpanded) {
    return (
      <>
        <div className="contact-card-expanded">
          <div className="contact-expanded-name-phone-email">
            <div className="inline-block">
              <MiniIconWrapper>
                <ContactStatusIndicator
                  windowOfLastContact={props.windowOfLastContact}
                  lastContact={props.lastContact.date}
                  checked={true} />
              </MiniIconWrapper>
            </div>
            <div className="ce-name">
              {props.person.name.first + " " + props.person.name.last}
            </div>
            <div className="ce-number">
              Phone Number: {props.person.phoneNumber}
            </div>
            <div className="ce-email">
              Email: {props.person.email ? props.person.email : null}
            </div>
          </div>
          <br />

          <div className="contact-expanded-recent-convos">
            <RecentConversations
              person={props.person}
              conversationArray={props.conversationArray}
            />
          </div>
          <div className="contact-expanded-action-buttons">
            <div className="act-btn-1">
              <ActionButton
                icon={<ReachOutIcon />}
                handleModalOpen={handleModalOpen}
                message={"we-spoke"}
                person={props.person}
              >
                We Spoke
              </ActionButton>
            </div>
            <br />
            <div className="act-btn-2">
              <ActionButton
                icon={<ConversationStartersIcon />}
                handleModalOpen={handleModalOpen}
                message={"convo-starters"}
                person={props.person}
              >
                Convo Starters
              </ActionButton>
            </div>
            <br />
            <div className="act-btn-3">
              <ActionButton
                icon={<ScheduleIcon />}
                handleModalOpen={handleModalOpen}
                message={`schedule-conv-w-${props.person.name.first}`}
                person={props.person}
              >
                Schedule Convo
              </ActionButton>
            </div>
            <br />
            <div className="act-btn-4">
              <ActionButton
                icon={<ContactSettingsIcon />}
                handleModalOpen={handleModalOpen}
                message={`settings-${props.person.name.first}`}
                person={props.person}
              >
                Contact's Settings
              </ActionButton>
            </div>

            <br />
          </div>

          <div className="contact-expanded-button-div">
            <button
              className="collapse-ct-card"
              onClick={(event) => handleExpand(event)}
            >
              Collapse
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!isExpanded) {
    return (
      <>
        <div onClick={handleExpand} className="contact-card">
          <div className="recent-contact-status-div">
            <MiniIconWrapper>
              <ContactStatusIndicator
                windowOfLastContact={props.windowOfLastContact}
                lastContact={props.lastContact.date}
                checked={true}
              />
            </MiniIconWrapper>
          </div>
          <div className="contact-name-and-last-cont-div">
            <span className="contact-name">
              {props.person.name.first + " " + props.person.name.last}
            </span>
            <span className="last-contact">
              {(props.person.lastConvo && Object.keys(props.person.lastConvo).length === 0)
                ? `Have a conversation with ${props.person.name.first + " " + props.person.name.last
                }!`
                : "Last Contact: "}
              {props.lastContact.date && getDateFromDateTime(props.lastContact.date)}
            </span>
          </div>
          <span className="last-convo-topic">
            {(props.person.lastConvo && Object.keys(props.person.lastConvo).length === 0)
              ? null
              : "Topic: "}
            {(props.lastContact) && props.lastContact.topic
              ?
              ((props.lastContact.topic).slice(0, 60).length == 60 ? ((props.lastContact.topic).slice(0, 60) + "...") : (props.lastContact.topic).slice(0, 60))
              : null}
          </span>
          <div className="contact-action-btns">
            <button
              onClick={(event) =>
                handleModalOpen(event, {
                  modalContentType: "schedule-conv",
                  person: props.person,
                })
              }
              className="schedule-btn flex justify-center items-center"
              title={`Schedule A Conversation With ${props.person.name.first}`}
            >
              <ScheduleIcon_2 />
            </button>
            <button
              onClick={(event) =>
                handleModalOpen(event, {
                  modalContentType: "we-spoke",
                  person: props.person,
                })
              }
              className="contact-btn"
              title={`Contact ${props.person.name.first}`}
            >
              <ReachOutIcon />
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default ContactCard;
