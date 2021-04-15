import { useMutation } from "@apollo/client";
import { CREATE_PROJECT_MUTATION } from "../../graphql/mutation";

const useCreateProject = (title, goal) => {
  const [createProject] = useMutation(CREATE_PROJECT_MUTATION, {
    variables: {
      input: {
        title,
        goal,
      },
    },
  });
  return createProject;
};

export default useCreateProject;
