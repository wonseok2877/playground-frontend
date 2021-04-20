import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { setToken } from "../apolloClient";
import checkRegex from "../functions/checkRegex";
import { useLogin } from "../hooks/mutation";
import { useLoginReducer } from "../hooks/reducer";
import LargeText from "./texts/LargeText";

const LoggingForm = () => {
  // Hook : 로그인 state들과 dispatch 함수들을 한번에 담아버림
  const { state, dispatch } = useLoginReducer();
  // useHistory
  const history = useHistory();
  // Hook : 로그인 Mutation
  const { loginMutation } = useLogin(state.nameText, state.passwordText);

  const eventHandler = {
    // 함수 정의 : submit event에 의한 mutation문 함수 호출, 실행
    handleSubmit: async (event) => {
      event.preventDefault();
      // 로직 : 이름과 비밀번호 비었을 경우
      if (!state.nameText) {
        dispatch({ type: "idMessage", payload: "아이디 입력하라우" });
        return;
      }
      console.log(state.passwordText);
      if (!state.passwordText) {
        dispatch({
          type: "passwordMessage",
          payload: "비밀번호 입력하라우",
        });
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
            type: "errorMessage",
            payload:
              error.graphQLErrors[0]?.extensions.exception.response.message[0],
          });
        } else {
          dispatch({ type: "errorMessage", payload: error.message });
        }
        return;
      } finally {
        // setState : 비밀번호만 empty string값으로. 까리하게ㅋㅋㅋ
        dispatch({ type: "passwordText", targetValue: "" });
      }
      // history.push() : 로그인 이후 에러가 없을 시 바로 홈으로
      history.push("/");
    },
    nameInputChange: (event) => {
      // trim method
      const targetValue = event.target.value.trim();
      dispatch({ type: "nameText", targetValue });
      // 함수 정의  : validation
      const checkIsValid = () => {
        if (targetValue.length > 0) {
          // if : 이름 글자 수 제한
          if (targetValue.length < 2 || targetValue.length > 6) {
            const payload = "2~5자를 사용하세요.";
            dispatch({ type: "idMessage", payload });
            return;
          } else {
            dispatch({ type: "idMessage", payload: "" });
          }
        } else {
          dispatch({ type: "idMessage", payload: "" });
        }
      };
      // function call
      checkIsValid();
    },
    passwordInputChange: (event) => {
      const targetValue = event.target.value.trim();
      dispatch({ type: "passwordText", targetValue });
      // 함수 정의 : validation
      const checkIsValid = () => {
        if (targetValue.length > 0) {
          // if : 비밀번호 글자 수 제한
          if (targetValue.length < 7) {
            const payload = "7자 이상 문자를 사용하세요.";
            dispatch({ type: "passwordMessage", payload });
            return;
            // if : regex로 대문자, 특수문자 최소한 한 글자씩
          } else if (!checkRegex(targetValue)) {
            const payload = "1자 이상의 특수문자와 대문자를 사용하세요. ";
            dispatch({ type: "passwordMessage", payload });
            return;
          } else {
            dispatch({ type: "passwordMessage", payload: "" });
          }
        } else {
          dispatch({ type: "passwordMessage", payload: "" });
        }
      };
      // function call
      checkIsValid();
    },
  };

  return (
    <>
      <div className="flex flex-col justify-evenly items-center m-auto w-7/12 h-full rounded-md bg-blue-200">
        <LargeText>Log in</LargeText>
        <form
          onSubmit={eventHandler.handleSubmit}
          className="w-full h-1/2 flex flex-col justify-evenly items-center "
        >
          <input
            value={state.nameText}
            onChange={eventHandler.nameInputChange}
            type="text"
            className="w-7/12 h-20 text-3xl p-5 focus:outline-none rounded-md"
          />
          <h3 className="w-7/12 h-9 text-red-500 text-center text-xl">
            {state.idMessage && (
              <div>
                <i class="fas fa-exclamation-triangle mr-3"></i>
                <span>{state.idMessage}</span>
              </div>
            )}
          </h3>
          <input
            value={state.passwordText}
            onChange={eventHandler.passwordInputChange}
            type="password"
            className=" w-7/12 h-20 text-3xl p-5 focus:outline-none rounded-md"
          />
          <h3 className=" w-7/12 h-9 text-red-500 text-center text-xl">
            {state.passwordMessage && (
              <div>
                <i class="fas fa-exclamation-triangle mr-3"></i>
                <span>{state.passwordMessage}</span>
              </div>
            )}
          </h3>
          <h3 className="text-red-500 text-center text-xl w-10/12">
            {state.errorMessage && (
              <div>
                <i class="fas fa-exclamation-triangle mr-3"></i>
                <span>{state.errorMessage}</span>
              </div>
            )}
          </h3>
          <button type="submit" className="w-7/12 h-1/6 rounded bg-green-600">
            Submit
          </button>
        </form>
        <Link
          to="register"
          className="pt-4 w-5/12 h-16  text-center text-2xl text-white bg-yellow-500 rounded"
        >
          새 계정 만들기
        </Link>
      </div>
    </>
  );
};

export default LoggingForm;
