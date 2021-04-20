import { useReducer } from "react";

const initialState = {
  nameText: "",
  passwordText: "",
  idMessage: "",
  passwordMessage: "",
  errorMessage: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "nameText":
      return {
        ...state,
        nameText: action.targetValue,
      };
    case "passwordText":
      return {
        ...state,
        passwordText: action.targetValue,
      };
    case "idMessage":
      return {
        ...state,
        idMessage: action.payload,
      };
    case "passwordMessage":
      return {
        ...state,
        passwordMessage: action.payload,
      };
    case "errorMessage":
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

const useLoginReducer = () => {
  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  //  destructuring : 여기서 쓰는 data는 이름과 비밀번호뿐이다.
  return { state, dispatch };
};

export default useLoginReducer;

// useReducer : state 5종류 갖고 있음
