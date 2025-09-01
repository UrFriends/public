import { getMostRecentConversation } from "@/hooks/getMostRecentConversation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Conversation, Person } from "../../types/Types";
import ContactCard from "./ContactCard";

const returnPastDate = (days: number) => {
  var pastDate = new Date(
    new Date().getTime() - 24 * days * 60 * 60 * 1000
  ).toLocaleDateString();
  return pastDate;
};

/**
 * Returns a formatted string for the given time period code.
 * @param timePeriod - The code for the time period (e.g., '1d', '1w').
 */
function interpolateTierTimePeriod(timePeriod: string): string {
  const mapping: Record<string, string> = {
    "1d": "1 Day",
    "2d": "2 Days",
    "3d": "3 Days",
    "4d": "4 Days",
    "5d": "5 Days",
    "6d": "6 Days",
    "1w": "1 Week",
    "2w": "2 Weeks",
    "3w": "3 Weeks",
    "1m": "1 Month",
    "30d": "1 Month",
    "2m": "2 Months",
    "3m": "3 Months",
    "4m": "4 Months",
    "5m": "5 Months",
    "6m": "6 Months",
    "u": "No Timeframe Selection"
  };
  return mapping[timePeriod] || "Error Formatting Data";
}

/**
 * Returns the past date string for the given time period code.
 * @param timePeriod - The code for the time period (e.g., '1d', '1w').
 */
function getLastContactDate(timePeriod: string): string {
  const daysMapping: Record<string, number> = {
    "1d": 1,
    "2d": 2,
    "3d": 3,
    "4d": 4,
    "5d": 5,
    "6d": 6,
    "1w": 7,
    "2w": 14,
    "3w": 21,
    "1m": 30,
    "30d": 30,
    "2m": 61,
    "3m": 90,
    "4m": 120,
    "5m": 153,
    "6m": 180,
  };
  const days = daysMapping[timePeriod];
  if (!days) return "No Date";
  return returnPastDate(days);
}



function Tier(props: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [windowOfLastContact, setWindowOfLastContact] = useState("");

  const dispatch = useDispatch();

  // Update windowOfLastContact when timeFrame changes
  useEffect(() => {
    setWindowOfLastContact(getLastContactDate(props.timeFrame));
  }, [props.timeFrame]);

  const handleExpand = (event: any) => {
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (!isExpanded) {
    return (
      <div
        onClick={(event) => handleExpand(event)}
        className="tier-container"
        title={`Click to Expand Tier ${props.tierName}`}
      >
        <span className="expand-collapse-span">
          <div className="expand-collapse-div">
            <i className="fa fa-caret-square-o-right"></i>
          </div>
        </span>
        <span className="tier-title-span">
          <p>
            {props.tierName != "Unorganized" ? "Tier " + props.tierName + " - " + interpolateTierTimePeriod(props.timeFrame) : "Unorganized"}
          </p>
          <p style={{ fontSize: "12px" }}>
            Contacted since: {windowOfLastContact}
          </p>
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={handleExpand}
        className="tier-container"
        title={`Click to Expand Tier ${props.tierName}`}
      >
        <span className="expand-collapse-span">
          <div className="expand-collapse-div">
            <i className="fa fa-caret-square-o-down"></i>
          </div>
        </span>
        <span className="tier-title-span">
          <p>
            {props.tierName != "Unorganized" ? "Tier " + props.tierName + " - " + interpolateTierTimePeriod(props.timeFrame) : "Unorganized"}
          </p>
          <p style={{ fontSize: "12px" }}>
            Contacted since: {windowOfLastContact}
          </p>
        </span>
      </div>
      {props.tierContents.map((person: Person) => {

        //put the conversations into an array, making them easier to iterate on in RecentConversations
        let conversationArray: Conversation[] = [];
        if (person.lastConvo && Object.keys(person.lastConvo).length !== 0) {
          const keys_of_conversations = Array.from(Object.keys(person.lastConvo));
          keys_of_conversations.forEach((key) => {
            if (person && person.lastConvo && typeof person.lastConvo[key] == "object") {
              const convToPush = {
                ...person.lastConvo[key],
                DocID: key,
              }
              conversationArray.push(convToPush);
            }
          });
        }

        return (
          <ContactCard
            conversationArray={conversationArray}
            lastContact={getMostRecentConversation(conversationArray)}
            windowOfLastContact={windowOfLastContact}
            key={`${person.name.first}-${person.name.last}`}
            person={person}
          />
        );
      })}
    </>
  );
}

export default Tier;
