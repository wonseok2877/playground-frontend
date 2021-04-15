import { useRegisterReducer } from "../hooks/reducer";
import RegisteringForm from "../components/RegisteringForm";

// ! : useReducer을 2가지 써야 한다. inputvalue를 담을 것과 메세지를 담을 것
const Register = () => {
  const {
    state: { info, message },
    handleChange,
    handleSubmit,
  } = useRegisterReducer();

  return (
    <>
      <RegisteringForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        info={info}
        message={message}
      />
    </>
  );
};

export default Register;
