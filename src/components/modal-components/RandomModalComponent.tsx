import { DiceIcon } from "@/components/icons/dice-icon";
import { IconWrapper } from "@/components/IconWrapper";
import { useState } from "react";

//export
const RandomModalComponent = () => {
  const [randomPerson, setRandomPerson] = useState({
    name: {
      first: "",
      last: ""
    }
  });

  const handleShuffle = () => {
    function getRandomPerson(obj: any) {
      const keys = Object.keys(obj);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const array = obj[randomKey];
      const randomValue = array[Math.floor(Math.random() * array.length)];
      setRandomPerson(randomValue);
    }
    // getRandomPerson(phonebookStore);
    //TODO: implement shuffle functionality
    console.log("this previously worked with the redux architecture")
  };

  return (
    <div className="flex content-center items-center flex-col">
      {randomPerson && `${randomPerson.name.first}`}
      <button
        onClick={handleShuffle}
        className="rounded-full flex align-middle justify-center p-[1em] m-[1em] bg-[var(--base-high-cont-color)] text-[var(--light-base-color)] cursor-pointer border-none hover:bg-[var(--base-high-cont-hover)]"
        aria-label="Random Interaction Button"
      >
        <IconWrapper>
          <DiceIcon />
        </IconWrapper>
      </button>
      The random button is in development
    </div>
  );
};

export default RandomModalComponent;
