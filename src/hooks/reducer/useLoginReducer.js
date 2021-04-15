import { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { authTokenVar, setToken } from "../../apolloClient";
import checkRegex from "../../functions/checkRegex";
import useLogin from "../mutation/useLogin";

const initialState = {
  info: {
    name: "",
    password: "",
  },
  message: {
    idMessage: "",
    passwordMessage: "",
    errorMessage: "",
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "input-name":
      return {
        ...state,
        info: { ...state.info, name: action.targetValue },
      };
    case "input-password":
      return {
        ...state,
        info: { ...state.info, password: action.targetValue },
      };
    case "message-id":
      return {
        ...state,
        message: { ...state.message, idMessage: action.payload },
      };
    case "message-password":
      return {
        ...state,
        message: { ...state.message, passwordMessage: action.payload },
      };
    case "message-error":
      return {
        ...state,
        message: { ...state.message, errorMessage: action.payload },
      };
    default:
      return state;
  }
};

const useLoginReducer = () => {
  console.log("6. Login Reducer context");
  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  //  destructuring : 여기서 쓰는 data는 이름과 비밀번호뿐이다.
  const { name, password } = state.info;
  // useHistory
  const history = useHistory();
  // Hook : 로그인 Mutation
  const { loginMutation } = useLogin(name, password);

  // 함수 정의 : submit event에 의한 mutation문 함수 호출, 실행
  const handleSubmit = async (event) => {
    event.preventDefault();
    // 로직 : 이름과 비밀번호 비었을 경우
    if (!name) {
      dispatch({ type: "message-id", payload: "아이디 입력하라우" });
      return;
    } else if (!password) {
      dispatch({ type: "message-password", payload: "비밀번호 입력하라우" });
      return;
    }
    // try & catch
    try {
      // 함수 호출 : 로그인 mutation문
      const {
        data: {
          login: { error, ok, token },
        },
      } = await loginMutation();

      // if : 서버쪽의 ok가 true일 경우
      if (ok && token) {
        // 함수 호출 : localstorage 함수안에다 data를 넣는다.
        // !!! : 이색기를 바꿔줘야 한다. request Headers에 들어가는 아이이기 때문.
        setToken(token);
      }
      // if : 서버쪽에서 error를 보내는 경우 throw new Error()
      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      if (error.graphQLErrors) {
        dispatch({
          type: "message-error",
          payload:
            error.graphQLErrors[0]?.extensions.exception.response.message[0],
        });
      } else {
        dispatch({ type: "message-error", payload: error.message });
      }
      return;
    } finally {
      // setState : 비밀번호만 empty string값으로. 까리하게ㅋㅋㅋ
      dispatch({ type: "input-password", targetValue: "" });
    }
    // history.push() : 로그인 이후 에러가 없을 시 바로 홈으로
    history.push("/");
  };
  // 객체 정의
  const handleChange = {
    checkId: (targetValue) => {
      dispatch({ type: "input-name", targetValue });
      // if : 이름 글자 수 제한
      if (targetValue.length < 2 || targetValue.length > 6) {
        const payload = "2~5자를 사용하세요.";
        dispatch({ type: "message-id", payload });
        return;
      } else {
        dispatch({ type: "message-id", payload: "" });
      }
    },
    checkPassword: (targetValue) => {
      dispatch({ type: "input-password", targetValue });
      // if : 비밀번호 글자 수 제한

      if (targetValue.length < 7) {
        const payload = "7자 이상 문자를 사용하세요.";
        dispatch({ type: "message-password", payload });
        return;
      } else {
        dispatch({ type: "message-password", payload: "" });
      }
      // if : regex로 대문자, 특수문자 최소한 한 글자씩
      if (!checkRegex(targetValue)) {
        const payload = "1자 이상의 특수문자를 사용하세요. ";
        dispatch({ type: "message-password", payload });
        return;
      } else {
        dispatch({ type: "message-password", payload: "" });
      }
    },
  };
  return { state, dispatch, handleSubmit, handleChange };
};

export default useLoginReducer;

// useReducer : state 5종류 갖고 있음
