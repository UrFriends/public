

export const HeroButton = (props: any) => {
  return (
    <button
      className="w-[7em] rounded-[1em] p-[0.5em] m-[1em] bg-[var(--base-high-cont-color)] text-[var(--light-base-color)] cursor-pointer border-none hover:bg-[var(--base-high-cont-hover)]"
      onClick={props.clickHandler}
    >
      <div className="flex flex-col content-center justify-center">
        <div className="flex content-center justify-center">
          {props.children}
        </div>
        <div className="text-center">
          {props.text}
        </div>
      </div>
    </button>
  );
};
