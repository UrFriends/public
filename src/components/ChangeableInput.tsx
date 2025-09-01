import { sendNotification } from "@/hooks/sendNotification";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ChangeableInput__Props } from "../../types/Types";
import { ModifyDataButton } from "./ModifyDataButton";
import { Input } from "./ui/input";


//an input element that modifies state stored higher in the form
export const ChangeableInput = (props: ChangeableInput__Props) => {
  const [editBool, setEditBool] = useState(false);
  const [inputVal, setInputVal] = useState(props.valueProp);
  const dispatch = useDispatch();

  const handleSaveInputData = async () => {

    //if the data has been changed
    if (inputVal != props.valueProp) {
      //try to update it on server
      try {
        // Ensure inputVal is string or number
        const safeInputVal: string | number = Array.isArray(inputVal)
          ? inputVal.join(",")
          : (typeof inputVal === "string" || typeof inputVal === "number")
            ? inputVal
            : "";

        setEditBool(!editBool)
        // if props and input are valid
        if (props.mutation && typeof props.mutation.mutate === "function") {
          // async mutate
          props.mutation.mutateAsync({ changeQualifier: props.valueProp, keyToChange: props.valueSwitch, change: safeInputVal });
        } else {
          //props and input are not valid
          sendNotification(dispatch, { message: "mutation is undefined, or props on ChangeableInput are broken", type: "red" });
          return false;
        }

      } catch {
        console.log("There was an error calling the service from ChangeableInput")
        return false
      }
    } else {

      // no change has been made to the inputVal
      setEditBool(!editBool);
    }
  }
  const style_var = "flex"
  const style_var_3 = "inline-block w-16 mr-4 "

  return (
    <div className="">

      {/* if they are changing it */}
      {editBool && (
        <div className={style_var}>
          <Input className={style_var_3}
            value={inputVal}
            onChange={(event) => setInputVal(event.target.value)}
          ></Input>
          <div className={style_var_3}>
            <ModifyDataButton
              text="Save"
              clickHandler={handleSaveInputData} />
          </div>
        </div>
      )}

      {/* If they did change it */}
      {!editBool && inputVal != props.valueProp && (
        <div className={style_var}>
          <div className={style_var_3}>
            {inputVal}</div>
          <div className={style_var_3}>
            <ModifyDataButton
              text="Edit"
              clickHandler={handleSaveInputData}
            />
          </div>
        </div>
      )}

      {/* If they didn't change it */}
      {!editBool && inputVal == props.valueProp && (
        <div className={style_var}>
          <div className={style_var_3}>
            {props.valueProp}
          </div>
          <div className={style_var_3}>
            <ModifyDataButton
              text="Edit"
              clickHandler={handleSaveInputData}
            />
          </div>
        </div>
      )}
    </div>
  );
};
