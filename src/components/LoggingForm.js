import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { setToken } from "../apolloClient";
import checkRegex from "../functions/checkRegex";
import { useLogin } from "../hooks/mutation";
import { useLoginReducer } from "../hooks/reducer";

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
      <form
        onSubmit={eventHandler.handleSubmit}
        className="w-full h-1/2 flex flex-col justify-evenly items-center "
      >
        <h3 className="text-red-500 text-center text-xl w-10/12">
          {state.errorMessage && (
            <div>
              <i class="fas fa-exclamation-triangle mr-3"></i>
              <span>{state.errorMessage}</span>
            </div>
          )}
        </h3>
        <div className="w-full flex flex-col items-center">
          <div>
            <i
              className={`far fa-user text-3xl text-gray-500 ${
                state.nameText && !state.idMessage && "text-green-700"
              }`}
            ></i>
            <input
              value={state.nameText}
              onChange={eventHandler.nameInputChange}
              type="text"
              className="w-10/12 h-20 pl-3 ml-1 text-3xl text-green-900 border-b-2 focus:border-green-900 focus:outline-none"
              placeholder="ID"
            />
          </div>
          <h3 className="w-9/12 h-9 text-red-500 text-center text-xl">
            {state.idMessage && (
              <div>
                <i className="fas fa-exclamation-triangle mr-3"></i>
                <span>{state.idMessage}</span>
              </div>
            )}
          </h3>
          <div>
            <i
              className={`fas fa-key text-3xl text-gray-500 ${
                state.passwordText && !state.passwordMessage && "text-green-700"
              }`}
            ></i>
            <input
              value={state.passwordText}
              onChange={eventHandler.passwordInputChange}
              type="password"
              className=" w-10/12 h-20 pl-3 ml-1 text-3xl text-green-900 border-b-2 focus:border-green-900 focus:outline-none"
              placeholder="password"
            />
          </div>
          <h3 className=" w-9/12 h-9 text-red-500 text-center text-xl">
            {state.passwordMessage && (
              <div>
                <i class="fas fa-exclamation-triangle mr-3"></i>
                <span>{state.passwordMessage}</span>
              </div>
            )}
          </h3>
        </div>
        <button
          type="submit"
          className={`w-6/12 h-1/6 rounded bg-green-600 text-2xl text-white 
          ${
            !state.nameText ||
            !state.passwordText ||
            state.idMessage ||
            state.passwordMessage
              ? "opacity-40 cursor-not-allowed"
              : ""
          }`}
          style={{ backgroundColor: "#065A6B" }}
        >
          Log in
        </button>
      </form>
      <Link
        to="register"
        className="pt-4 w-6/12 h-16  text-center text-2xl text-gray-500 underline"
      >
        계정이 없으신가요? 회원가입
      </Link>
    </>
  );
};

export default LoggingForm;
