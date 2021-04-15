import { useReducer } from "react";

const initialState = {
  isTitleSelected: false,
  isGoalSelected: false,
  isContainerSelected: false,
  focusedContainer: "",
  selectedContainerToEdit: "",

  subjectTitle: "",
  goalTitle: "",
  newContainerTitle: "",
  edittedContainerTitle: "",

  subjectErrorMessage: "",
  goalErrorMessage: "",
  createContainerErrorMessage: "",
  editContainerErrorMessage: "",
};
// 함수 정의
const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case type:
      return {
        ...state,
        // [] : ES6 문법 ! 변수를 object key로써 그대로 넣을 수 있음.
        // 단, 지금처럼 쓰는건 하나의 type에 하나의 payload가 들어갈 때에만. 그리고 인위적으로 state의 이름과 type의 이름을 똑같게 만들었기 때문에 이게 되는거임.
        [type]: payload,
      };
    default:
      return state;
  }
};
// 함수 정의
const useSubjectDetailReducer = () => {
  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    dispatch,
  };
};

export default useSubjectDetailReducer;
