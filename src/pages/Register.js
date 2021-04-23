import NavBar from "../components/NavBar";
import RegisteringForm from "../components/RegisteringForm";

// ! : useReducer을 2가지 써야 한다. inputvalue를 담을 것과 메세지를 담을 것
const Register = () => {
  return (
    <>
      <NavBar />
      <RegisteringForm />
    </>
  );
};

export default Register;
