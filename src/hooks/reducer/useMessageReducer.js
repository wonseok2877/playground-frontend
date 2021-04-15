import { useReducer } from "react";

const initialState = {
  createTodoErrorMessage: "",
  projectErrorMessage: "",
  goalErrorMessage: "",
  editTodoErrorMessage: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "project_message":
      return {
        ...state,
        projectErrorMessage: action.payload,
      };
    case "goal_message":
      return {
        ...state,
        goalErrorMessage: action.payload,
      };
    case "create-todo_message":
      return {
        ...state,
        createTodoErrorMessage: action.payload,
      };
    case "edit-todo_message":
      return {
        ...state,
        editTodoErrorMessage: action.payload,
      };

    // case에 맞지 않는 경우엔 initialState를 보냄.
    default:
      return state;
  }
};

const useMessageReducer = () => {
  const [state, dispatchMessage] = useReducer(reducer, initialState);

  return { state, dispatchMessage };
};

export default useMessageReducer;
