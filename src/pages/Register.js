import RegisteringForm from "../components/RegisteringForm";

// ! : useReducer을 2가지 써야 한다. inputvalue를 담을 것과 메세지를 담을 것
const Register = () => {
  return (
    <>
      <div
        className="h-screen flex justify-center items-center "
        style={{
          backgroundColor: "#dfe4ea",
        }}
      >
        <div className="z-10 h-5/6 w-11/12 flex flex-row justify-center items-center shadow-2xl">
          <div
            className="w-1/2 h-full p-12 flex flex-col justify-between items-center text-white"
            style={{ backgroundColor: "#032F38" }}
          >
            <h1 className="text-6xl">Playground.</h1>
            <h2 className="text-2xl">전설의 시작이..랄까?</h2>
            <h3 className="text-xl">MD중심의 협업 툴</h3>
          </div>
          <div className="w-7/12 h-full bg-white">
            <div className="h-full flex flex-col justify-center items-center">
              <div className="w-11/12 h-5/6 py-6 flex flex-col items-center rounded-lg">
                <RegisteringForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
