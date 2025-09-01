import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendNotification } from "@/hooks/sendNotification";
import { FormEvent } from "react";
import { useDispatch } from "react-redux";
import { add_Contact } from "../../../services/fireBaseServices";
import { NewPerson__Props } from "../../../types/Types";
import { addContact } from "../features/dataSlice";
import { Button } from "../ui/button";


const NewPerson = (props: NewPerson__Props) => {
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    //gather the form submission
    const newPerson = {
      tier: (form.elements.namedItem("tier") as HTMLInputElement)?.value,
      name: {
        first: (form.elements.namedItem("contactFirstName") as HTMLInputElement)?.value,
        last: (form.elements.namedItem("contactLastName") as HTMLInputElement)?.value,
      },
      phoneNumber: (form.elements.namedItem("contactPhone") as HTMLInputElement)?.value,
      email: (form.elements.namedItem("contactEmail") as HTMLInputElement)?.value,
      lastConvo: {},
      user: props.user.uid,
    };

    //call async service
    const callService = async () => {
      try {
        const result = await add_Contact(props.user.uid, newPerson);
        if (!result) {
          //dispatch a failure notifications
          console.log("ERROR with result in callService, NewPerson")
          return false;
        } else {
          //update the store and the UI
          //dispatch success notification
          dispatch(addContact(newPerson))
          console.log("TODO: establish notification service functionality for adding contact")
          return true;
        }
      } catch (error) {
        console.log(error, "ERROR callService in NewPerson")
        return false;
      }
    }
    if (!callService()) {
      sendNotification(dispatch, { message: "the data submitted was invalid", type: "red" })
    }
  }

  //render
  return (
    <>
      <div className="styled-grid-form-container">
        <form
          className="styled-grid-form"
          onSubmit={(event) => handleSubmit(event)}
        >
          <span className="styled-grid-form-txt">First Name:</span>
          <input
            className="styled-grid-form-input"
            name="contactFirstName"
          ></input>
          <span className="styled-grid-form-txt">Last Name:</span>{" "}
          <input
            className="styled-grid-form-input"
            name="contactLastName"
          ></input>
          <span className="styled-grid-form-txt">Phone:</span>{" "}
          <input className="styled-grid-form-input" name="contactPhone"></input>
          <span className="styled-grid-form-txt">Email:</span>{" "}
          <input className="styled-grid-form-input" name="contactEmail"></input>

          <div>
            <Select name="tier">
              <SelectTrigger className="w-[80%]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(props.settings?.tiersTime) &&
                  props.settings.tiersTime.map((tier) => (
                    <div key={tier.name}>
                      <SelectItem value={tier.name} key={`${tier}-key-select`}>
                        {tier.name}
                      </SelectItem>
                    </div>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <br />
          <div>
            <Button variant="outline" type="submit">
              Add Person
            </Button>
          </div>
        </form>
      </div >
    </>
  );
};

export default NewPerson;
