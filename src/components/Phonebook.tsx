
import { tiersTime_Object } from "../../types/Types";
import Tier from "./Tier";


//export
function Phonebook(props: any) {
  if (!props.data) {
    return null;
  }

  return (
    <>
      <div>
        {/* <LinkBar page="phonebook" /> */}

        {/*contacts-list section is the flex container for contact-cards-div and any content below the header*/}
        <section id="contacts-list">
          {/*contact-cards-div is where the tiers and contact cards will be displayed.*/}
          <div id="contact-cards-div">

            {/* Tiers that are in the settings Object */}
            {props.data && Object.hasOwn(props.data, "phonebook") && props.data.settings.tiersTime.map((tier: tiersTime_Object) => {
              let tier_contents = [];
              tier_contents = [...props.data.phonebook[tier.name]];

              return (
                <article key={tier.name} className="tier-and-contacts-container">
                  <Tier
                    tierName={tier.name}
                    timeFrame={tier.timeFrame}
                    tierContents={tier_contents}
                  />
                </article>
              );
            })}

            {/* Unorganized Tier (In the event that a contact has a tier which is not in the settings) */}
            {props.data && Object.hasOwn(props.data, "phonebook") && props.data.phonebook["unorganized"] &&
              <article className="tier-and-contacts-container">
                <Tier
                  tierName={"Unorganized"}
                  timeFrame={""}
                  tierContents={props.data.phonebook["unorganized"]}
                />
              </article>
            }
          </div>
        </section>
      </div>
    </>
  );
}

export default Phonebook;
