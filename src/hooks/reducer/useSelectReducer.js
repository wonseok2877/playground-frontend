import { useReducer } from "react";

const initialState = {
  isTitleSelected: false,
  isGoalSelected: false,
  selectedTodoId: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "project_selected":
      return {
        ...state,
        isTitleSelected: action.payload,
      };
    case "goal_selected":
      return {
        ...state,
        isGoalSelected: action.payload,
      };
    case "todo_selected-id":
      return {
        ...state,
        selectedTodoId: action.payload,
      };
    default:
      return state;
  }
};

const useSelectReducer = () => {
  const [state, dispatchSelected] = useReducer(reducer, initialState);

  return {
    state,
    dispatchSelected,
  };
};

export default useSelectReducer;
