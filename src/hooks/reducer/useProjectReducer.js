import { useReducer } from "react";

const initialState = {
  subjectText: "",
  goalText: "",
  isModified: false,
};

const func = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "subjectText":
      return { ...state, subjectText: payload };
    case "goalText":
      return { ...state, goalText: payload };
    case "isModified":
      return { ...state, isModified: payload };
    default:
      return state;
  }
};

const useProjectReducer = () => {
  const [state, dispatch] = useReducer(func, initialState);
  return { state, dispatch };
};

export default useProjectReducer;
