import { useDispatch } from "react-redux";
// import { showSideMenu } from "./features/sideMenuSlice";
import { DiceIcon } from "@/components/icons/dice-icon";
import { IconWrapper } from "@/components/IconWrapper";
import { setVisibleModal } from "./features/modalSlice";

function RandomButtonBar() {
  const dispatch = useDispatch();

  const handleOpenSideMenu = () => {
    // dispatch(showSideMenu([]));
  };

  const handleRandom = () => {
    dispatch(
      setVisibleModal({
        modalContentType: "random",
        title: "Random Interaction Machine",
      })
    );
  };

  return (
    <>
      <button
        onClick={handleRandom}
        aria-label="Random Interaction Button"
        className="rounded-full flex align-middle justify-center p-[1em] m-[1em] bg-[var(--base-high-cont-color)] text-[var(--light-base-color)] cursor-pointer border-none hover:bg-[var(--base-high-cont-hover)]"
      >
        <IconWrapper>
          <DiceIcon />
        </IconWrapper>
      </button>
    </>
  );
}

export default RandomButtonBar;
