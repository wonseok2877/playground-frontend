import { useReducer } from "react";
import { useHistory } from "react-router-dom";
import checkRegex from "../../functions/checkRegex";
import useRegister from "../mutation/useRegister";

const initialState = {
  nameText: "",
  passwordText: "",
  confirmPasswordText: "",
  idMessage: "",
  passwordMessage: "",
  confirmPasswordMessage: "",
  errorMessage: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "input_name":
      return {
        ...state,
        nameText: action.targetValue,
      };
    case "input_password":
      return {
        ...state,
        passwordText: action.targetValue,
      };
    case "confirmPasswordText":
      return {
        ...state,
        confirmPasswordText: action.targetValue,
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
    case "confirmPasswordMessage":
      return {
        ...state,
        confirmPasswordMessage: action.payload,
      };
    case "errorMessage":
      return {
        ...state,
        errorMessage: action.payload,
      };
    // case에 맞지 않는 경우엔 initialState를 보냄.
    default:
      return state;
  }
};

const useRegisterReducer = () => {
  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useRegisterReducer;
