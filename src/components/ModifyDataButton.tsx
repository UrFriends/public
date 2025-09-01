import { ModifyDataButton__Props } from "../../types/Types";
import { Button } from "./ui/button";


export const ModifyDataButton = (props: ModifyDataButton__Props) => {
  //edit is a prop
  return (
    <Button onClick={props.clickHandler} variant="outline">{props.text}</Button>
  );
};

