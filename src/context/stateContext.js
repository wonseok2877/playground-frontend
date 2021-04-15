import { createContext, useState } from "react";

export const stateContext = createContext();

export const StateContextProvider = (props) => {
  // useState
  const [isSideBar, setIsSideBar] = useState(false);
  return (
    <stateContext.Provider value={{ isSideBar, setIsSideBar }}>
      {props.children}
    </stateContext.Provider>
  );
};
