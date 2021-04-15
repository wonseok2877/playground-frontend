import { useMutation } from "@apollo/client";
import { EDIT_SUBJECT_MUTATION } from "../../graphql/mutation";

const useEditSubject = (projectId, subjectId, title, goal) => {
  const [editSubject] = useMutation(EDIT_SUBJECT_MUTATION, {
    variables: {
      input: {
        projectId,
        subjectId,
        title,
        goal,
      },
    },
  });
  return { editSubject };
};

export default useEditSubject;
