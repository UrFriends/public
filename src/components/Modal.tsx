import { useDispatch } from "react-redux";
import { clearUnsavedChanges, hideModal } from "./features/modalSlice";

import useEscapeKey from "../hooks/use-escape-key";
import AddConversationSelectContact from "./modal-components/AddConversationSelectContact";
import ContactSettings from "./modal-components/ContactSettings";
import ConversationDetails from "./modal-components/ConversationDetails";
import ConvoStarters from "./modal-components/ConvoStarters";
import NewPerson from "./modal-components/NewPerson";
import RandomModalComponent from "./modal-components/RandomModalComponent";
import ReachOut from "./modal-components/ReachOut";
import ScheduleConvo from "./modal-components/ScheduleConvo";
import TierSettings from "./modal-components/TierSettings";


import { useAppSelector } from "@/hooks/use-app-selector";
import { Modal__Props } from "../../types/Types";




//TODO: configure props interface for modal

const Modal = (props: Modal__Props) => {
  console.log(props, "TODO: configure props interface for modal")
  const modalVisible = useAppSelector((state) => state.modal.visible);
  const unsavedChanges = useAppSelector((state) => state.modal.unsavedChanges);

  const modalType = useAppSelector((state) => state.modal.type);
  const modalTitle = useAppSelector((state) => state.modal.title);

  const dispatch = useDispatch();


  const handleClose = () => {
    if (unsavedChanges) {
      //alert about unsaved changes

      if (confirm("you made changes that were not saved. Click OK to abandon changes.")) {
        dispatch(hideModal([]));
        dispatch(clearUnsavedChanges([]));
      } else {
        //keep the window open
      }
    } else {
      dispatch(hideModal([]));
    }
  };

  useEscapeKey(() => dispatch(hideModal([])));

  //render
  if (!modalVisible) {
    return null;
  }

  if (props) {
    console.log(props, "Props on Modal")
  }


  return (
    <>
      <div className="modal-base-transparency">
        <div className="modal-base-transparency">
          <div className="modal-box">
            <div className="modal-top-bar">
              <h2 style={{ gridArea: "title" }}>{modalTitle}</h2>
              <button
                style={{ gridArea: "close" }}
                className="modal-close-btn"
                onClick={handleClose}
              >
                X
              </button>
            </div>
            {modalType == "add-convo-sans-contact" && (<AddConversationSelectContact />)}
            {modalType == "random" && <RandomModalComponent />}
            {modalType == "add-contact" && <NewPerson user={props.user} settings={props.data.settings} />}
            {modalType == "we-spoke" && <ReachOut data={props.data} user={props.user} />}
            {modalType == "convo-starters" && <ConvoStarters />}
            {modalType.slice(0, 13) == "schedule-conv" && <ScheduleConvo />}
            {modalType.slice(0, 8) == "settings" && <ContactSettings user={props.user} />}
            {modalType == "tier-settings" && <TierSettings user={props.user} settings={props.data.settings} />}
            {modalType == "conversation" && (<ConversationDetails user={props.user} />)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;


