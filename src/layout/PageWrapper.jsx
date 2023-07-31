import Header from "./Header";

export default ({ children }) => {
  return (
    <div className="flex absolute top-0 left-0 bottom-0 bg-neutral-200 right-0 overflow-hidden">
      <div className="relative flex flex-col flex-1 w-full">
        <Header />
        {children}
      </div>
    </div>
  );
};
