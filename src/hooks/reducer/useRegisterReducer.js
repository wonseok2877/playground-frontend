import { useReducer } from "react";
import { useHistory } from "react-router-dom";
import checkRegex from "../../functions/checkRegex";
import useRegister from "../mutation/useRegister";

const initialState = {
  info: {
    name: "",
    password: "",
    confirmPassword: "",
  },
  message: {
    idMessage: "",
    passwordMessage: "",
    confirmPasswordMessage: "",
    errorMessage: "",
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "input_name":
      return {
        ...state,
        info: { ...state.info, name: action.targetValue },
      };
    case "input_password":
      return {
        ...state,
        info: { ...state.info, password: action.targetValue },
      };
    case "input_confirm-password":
      return {
        ...state,
        info: { ...state.info, confirmPassword: action.targetValue },
      };
    case "message_id":
      return {
        ...state,
        message: { ...state.message, idMessage: action.payload },
      };
    case "message_password":
      return {
        ...state,
        message: { ...state.message, passwordMessage: action.payload },
      };
    case "message_confirm-password":
      return {
        ...state,
        message: { ...state.message, confirmPasswordMessage: action.payload },
      };
    case "message_error":
      return {
        ...state,
        message: { ...state.message, errorMessage: action.payload },
      };
    // case에 맞지 않는 경우엔 initialState를 보냄.
    default:
      return state;
  }
};

const useRegisterReducer = () => {
  // useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  const { name, password, confirmPassword } = state.info;
  // useHistory
  const history = useHistory();
  // useMutation : 회원가입
  const { registerMutation } = useRegister(name, password);

  // 함수 정의 : onSubmit
  const handleSubmit = async (event) => {
    event.preventDefault();

    // try & catch
    try {
      // 함수 호출 : register mutation
      const {
        data: {
          createAccount: { error, ok },
        },
      } = await registerMutation();
      // if : 서버의 응답이 ok가 아니면서 error가 있을 경우, throw new Error()
      if (ok) {
        console.log(ok);
      } else if (error) {
        throw new Error(error);
      }
    } catch (error) {
      // ? : 같은 graphQL 에러여도 아이디에러인지 이메일 에러인지 어떻게 분간시킬까. 서버와의 약속이 있어야 한다.
      // if : extensions로 오냐 아니냐에 따라서 다른 객체의 주소를 넣어준다.
      // graphQLErrors : 시이이이이이이잉부레
      if (error.graphQLErrors) {
        dispatch({
          type: "message_error",
          payload:
            error.graphQLErrors[0].extensions.exception.response.message[0],
        });
      } else {
        dispatch({ type: "message_error", payload: error.message });
      }
      // ! : 여기서 return하는게 중요하다. 함수 실행을 중단해야 함.
      return;
    } finally {
      // setState : 이름과 패스워드를 다시 빈 값으로.
    }
    // ? : push를 하면 해당 페이지에 있던 local state가 아예 초기화되는 거겠지?
    history.push("/login");
  };

  // 객체 정의
  const handleChange = {
    // 함수 정의 : onChange에 대해서 input값을 setState하고, 조건문으로 메세지 setState
    checkId: (targetValue) => {
      dispatch({ type: "input_name", targetValue });
      // if : 이름 글자 수 제한
      if (targetValue.length < 2 || targetValue.length > 6) {
        const payload = "2~5자를 사용하세요.";
        dispatch({ type: "message_id", payload });
        return;
      } else {
        dispatch({ type: "message_id", payload: "" });
      }
    },
    checkPassword: (targetValue) => {
      dispatch({ type: "input_password", targetValue });

      // if : 비밀번호 글자 수 제한

      if (targetValue.length < 7) {
        const payload = "7자 이상 문자를 사용하세요.";
        dispatch({ type: "message_password", payload });
        return;
      } else {
        dispatch({ type: "message_password", payload: "" });
      }
      // if : regex로 대문자, 특수문자 최소한 한 글자씩
      if (!checkRegex(targetValue)) {
        const payload = "1자씩의 특수문자과 대문자를 사용하세요. ";
        dispatch({ type: "message_password", payload });
        return;
      } else {
        dispatch({ type: "message_id", payload: "" });
      }
    },
    // if : 비밀번호 확인
    checkConfirmPassword: (targetValue) => {
      dispatch({ type: "input_confirm-password", targetValue });
      if (targetValue !== password) {
        const payload = "비밀번호와 일치하지 않습니다.";
        dispatch({ type: "message_confirm-password", payload });
      } else {
        dispatch({ type: "message_confirm-password", payload: "" });
      }
    },
  };

  return { state, dispatch, handleSubmit, handleChange };
};

export default useRegisterReducer;
