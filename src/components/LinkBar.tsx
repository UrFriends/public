import { GearWheelIcon } from "@/components/icons/gearWheel-icon";
import { PersonIcon } from "@/components/icons/person-icon";
import { IconWrapper } from "@/components/IconWrapper";
import { useDispatch } from "react-redux";
import { setVisibleModal } from "./features/modalSlice";
import { HeroButton } from "./HeroButton";

//static; passed to HeroButton as props
const PhonebookButtonIcon = () => {
  return <i className="fa-regular fa-face-smile fa-3x"></i>;
};

//static; passed to HeroButton as props
const AddUserIcon = () => {
  return <i className="fa-solid fa-user-plus fa-3x"></i>;
};
//static; passed to HeroButton as props
const BulkAddIcon = () => {
  return <i className="fa-regular fa-address-book fa-3x"></i>;
};
//static; passed to HeroButton as props
const EditTiersIcon = () => {
  return <i className="fa-solid fa-users-gear fa-3x"></i>;
};
//static; passed to HeroButton as props
const CalendarIcon = () => {
  return <i className="fa-regular fa-calendar-days fa-3x"></i>;
};
//static; passed to HeroButton as props
const ConvoIcon = () => {
  return <i className="fa-regular fa-comment fa-3x"></i>;
};


const LinkBar = (props: any) => {
  const dispatch = useDispatch();

  const addContact = () => {
    dispatch(setVisibleModal({ modalContentType: "add-contact", title: "Add New Person" }));
  };

  const addConvoSansPerson = () => {
    dispatch(setVisibleModal({ modalContentType: "add-convo-sans-contact", title: "Add Conversation" }));
  };

  const changeSettings = () => {
    dispatch(setVisibleModal({ modalContentType: "tier-settings", title: "Settings" }));
  };



  return (
    <>
      <div className="link-bar-container">
        <HeroButton
          clickHandler={changeSettings}
          text="Settings"
        >
          <IconWrapper><GearWheelIcon /></IconWrapper>
        </HeroButton>
        <HeroButton
          clickHandler={addContact}
          text="Add Contact"
        ><IconWrapper><PersonIcon /></IconWrapper>
        </HeroButton>
      </div>
    </>
  );
};

export default LinkBar;
