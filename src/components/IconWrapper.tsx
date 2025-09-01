export function IconWrapper(props: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="w-20 h-20 fill-[var(--light-base-color)] ">
      {props.children}
    </div>
  );
}
