import LoggingForm from "../components/LoggingForm";

// ? : IP에 따라 횟수제한을 걸고 싶다. 지금은 하나의 아이디에 대해서만 횟수제한을 걸음.
// ? : 비밀번호가 회원가입할 때의 조건을 충족시키지 못하면 다른 에러를 발생시키고 서버쪽에서 실패 카운트를 안 한다. 로그인할 때엔 회원가입과 같은 로직을 취해선 안된다고 생각한다.

const Login = () => {
  return (
    <>
      <div
        className="h-screen  flex justify-center items-center "
        style={{
          backgroundColor: "#dfe4ea",
        }}
      >
        <div className="z-10 h-5/6 w-11/12 max-w-7xl flex flex-row justify-center items-center shadow-2xl">
          <div
            className="w-1/2 h-full p-12 flex flex-col justify-between items-center text-white"
            style={{ backgroundColor: "#032F38" }}
          >
            <h1 className="text-6xl">Playground.</h1>
            <h2 className="text-2xl">전설의 시작이..랄까?</h2>
            <h3 className="text-xl">MD중심의 협업 툴</h3>
          </div>
          <div className="w-7/12 h-full m-auto flex flex-col justify-evenly items-center bg-white">
            <LoggingForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
