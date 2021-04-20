import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import checkRegex from "../functions/checkRegex";
import { useRegister } from "../hooks/mutation";
import { useRegisterReducer } from "../hooks/reducer";
import LargeText from "./texts/LargeText";
import MediumText from "./texts/MediumText";

const RegisteringForm = () => {
  const { state, dispatch } = useRegisterReducer();

  // useHistory
  const history = useHistory();
  // useMutation : 회원가입
  const { registerMutation } = useRegister(state.nameText, state.passwordText);

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

  // useEffect : passwordText state
  useEffect(() => {
    console.log("effect.");
    // 함수 정의
    const checkIsPasswordSame = () => {
      if (state.confirmPasswordText.length > 0) {
        if (state.confirmPasswordText !== state.passwordText) {
          const payload = "비밀번호와 일치하지 않습니다.";
          dispatch({ type: "confirmPasswordMessage", payload });
        } else {
          dispatch({ type: "confirmPasswordMessage", payload: "" });
        }
      } else {
        dispatch({ type: "confirmPasswordMessage", payload: "" });
      }
    };
    checkIsPasswordSame();
  }, [state.passwordText]);

  // 객체 정의
  const handleChange = {
    // 함수 정의 : onChange에 대해서 input값을 setState하고, 조건문으로 메세지 setState
    nameInputChange: (event) => {
      console.log("function called.");
      const targetValue = event.target.value.trim();
      dispatch({ type: "input_name", targetValue });
      // 함수 정의 : validation
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
      dispatch({ type: "input_password", targetValue });
      // 함수 정의
      const checkIsValid = () => {
        if (targetValue.length > 0) {
          // if : 비밀번호 글자 수 제한
          if (targetValue.length < 7) {
            const payload = "7자 이상 문자를 사용하세요.";
            dispatch({ type: "passwordMessage", payload });
            return;
          }
          // if : regex로 대문자, 특수문자 최소한 한 글자씩
          if (!checkRegex(targetValue)) {
            const payload = "1자이상의 특수문자과 대문자를 사용하세요. ";
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
    // if : 비밀번호 확인
    checkConfirmPassword: (event) => {
      const targetValue = event.target.value.trim();

      dispatch({ type: "confirmPasswordText", targetValue });
      // 함수 정의
      const checkIsValid = () => {
        if (targetValue.length > 0) {
          if (targetValue !== state.passwordText) {
            const payload = "비밀번호와 일치하지 않습니다.";
            dispatch({ type: "confirmPasswordMessage", payload });
          } else {
            dispatch({ type: "confirmPasswordMessage", payload: "" });
          }
        } else {
          dispatch({ type: "confirmPasswordMessage", payload: "" });
        }
      };

      // function call
      checkIsValid();
    },
  };
  return (
    <>
      <div className="bg-yellow-500 h-screen">
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col items-center w-9/12 h-5/6 py-6 rounded-lg bg-yellow-400">
            <LargeText>회원가입</LargeText>
            <form
              onSubmit={handleSubmit}
              className=" w-full flex flex-col justify-evenly items-center"
            >
              <div className="w-4/6 h-36 flex justify-between items-start">
                <MediumText>아이디</MediumText>
                <div className="w-80 flex flex-col items-start">
                  <input
                    value={state.nameText}
                    // trim()
                    onChange={handleChange.nameInputChange}
                    // onBlur : 포커스 아웃될 때 함수 실행
                    type="text"
                    className="h-20 text-3xl pl-4 rounded-md focus:outline-none"
                  />
                  <h3 className="h-12 mt-2 ml-2 text-red-500 text-center text-xl">
                    {state.nameText.length > 0 && !state.idMessage && (
                      <i className="fas fa-check text-green-500"></i>
                    )}
                    {state.idMessage && (
                      <div>
                        <i class="fas fa-exclamation-triangle mr-3"></i>
                        <span>{state.idMessage}</span>
                      </div>
                    )}
                  </h3>
                </div>
              </div>
              <div className="w-4/6 h-40 flex justify-between items-start">
                <MediumText>비밀번호</MediumText>
                <div className="w-80 flex flex-col items-start">
                  <input
                    value={state.passwordText}
                    onChange={handleChange.passwordInputChange}
                    type="password"
                    className="h-20 text-3xl pl-4 rounded-md focus:outline-none"
                  />
                  <h3 className="h-12 mt-2 ml-2 text-red-500 text-center text-xl">
                    {state.passwordText.length > 0 &&
                      !state.passwordMessage && (
                        <i className="fas fa-check text-green-500"></i>
                      )}
                    {state.passwordMessage && (
                      <div>
                        <i class="fas fa-exclamation-triangle mr-3"></i>
                        <span>{state.passwordMessage}</span>
                      </div>
                    )}
                  </h3>
                </div>
              </div>
              <div className="w-4/6 h-40 flex justify-between items-start">
                <MediumText>비밀번호 재확인</MediumText>
                <div className="w-80 flex flex-col items-start">
                  <input
                    value={state.confirmPasswordText}
                    onChange={handleChange.checkConfirmPassword}
                    type="password"
                    className="h-20 text-3xl pl-4 rounded-md focus:outline-none"
                  />
                  <h3 className="h-12 mt-2 ml-2 text-red-500 text-center text-xl">
                    {state.confirmPasswordText.length > 0 &&
                      !state.confirmPasswordMessage &&
                      !state.passwordMessage && (
                        <i className="fas fa-check text-green-500"></i>
                      )}
                    {state.confirmPasswordMessage && (
                      <div>
                        <i class="fas fa-exclamation-triangle mr-3"></i>
                        <span>{state.confirmPasswordMessage}</span>
                      </div>
                    )}
                  </h3>
                </div>
              </div>
              <h3 className="h-12 text-red-500 text-center text-xl">
                {state.errorMessage && state.errorMessage}
              </h3>
              {state.idMessage ||
              state.passwordMessage ||
              state.confirmPasswordMessage ? (
                <button
                  disabled
                  type="submit"
                  className="w-4/12 h-1/6 opacity-30 cursor-not-allowed rounded bg-green-600"
                >
                  Submit
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-4/12 h-1/6 rounded bg-green-600"
                >
                  Submit
                </button>
              )}
            </form>
            <Link
              to="login"
              className="pt-4 w-5/12 h-24  text-center text-2xl bg-pink-300 text-blue-400 rounded"
            >
              이미 가입되어 있으신가요 ? 로그인
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisteringForm;
