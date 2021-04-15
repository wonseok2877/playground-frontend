import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../graphql/mutation";

const useLogin = (name, password) => {
  // useMutation : 이름과 패스워드를 인풋으로 넣는 로그인
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    variables: {
      input: {
        name,
        password,
      },
    },
  });
  return { loginMutation };
};

export default useLogin;
