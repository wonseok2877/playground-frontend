import { useMutation } from "@apollo/client";
import { CREATE_SUBJECT_MUTATION } from "../../graphql/mutation";

const useCreateSubject = (projectId, title, goal) => {
  const [createSubject] = useMutation(CREATE_SUBJECT_MUTATION, {
    variables: {
      input: {
        projectId,
        title,
        goal,
      },
    },
  });
  return { createSubject };
};

export default useCreateSubject;
