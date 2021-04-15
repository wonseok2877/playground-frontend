import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../graphql/mutation";

const useRegister = (name, password, role = "Admin") => {
  const [registerMutation] = useMutation(REGISTER_MUTATION, {
    variables: {
      input: {
        name,
        password,
        // ? : superAdmin과 그냥 Admin은 어떻게 분기처리할 것인가?
        // superAdmin의 token과 그것을 필요로 하는 권한 부여 mutation이 필요하다.
        role,
      },
    },
  });
  return { registerMutation };
};

export default useRegister;
