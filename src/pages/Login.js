import LoggingForm from "../components/LoggingForm";
import { useLoginReducer } from "../hooks/reducer";

// ? : IP에 따라 횟수제한을 걸고 싶다. 지금은 하나의 아이디에 대해서만 횟수제한을 걸음.
// ? : 비밀번호가 회원가입할 때의 조건을 충족시키지 못하면 다른 에러를 발생시키고 서버쪽에서 실패 카운트를 안 한다. 로그인할 때엔 회원가입과 같은 로직을 취해선 안된다고 생각한다.

const Login = () => {
  console.log("5. Login context");
  // Hook : 로그인 state들과 dispatch 함수들을 한번에 담아버림
  const {
    state: { info, message },
    handleChange,
    handleSubmit,
  } = useLoginReducer();
  return (
    <>
      <div className="bg-black h-screen">
        <div className="flex flex-row items-center h-5/6 w-full p-6">
          <LoggingForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            info={info}
            message={message}
          />
        </div>
      </div>
    </>
  );
};

export default Login;
