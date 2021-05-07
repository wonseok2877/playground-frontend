import { createContext, useState } from "react";

export const stateContext = createContext();

export const StateContextProvider = (props) => {
  // useState
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <stateContext.Provider value={{ isSideBarOpen, setIsSideBarOpen }}>
      {props.children}
    </stateContext.Provider>
  );
};
