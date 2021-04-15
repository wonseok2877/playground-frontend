import { useMutation } from "@apollo/client";
import { DELETE_SUBJECT_MUTATION } from "../../graphql/mutation";

const useDeleteSubject = () => {
  const [deleteSubject] = useMutation(DELETE_SUBJECT_MUTATION);

  const deleteSubjectById = async (projectId, SubjectId) => {
    const { data } = await deleteSubject({
      variables: {
        input: {
          projectId,
          SubjectId,
        },
      },
    });
    return data;
  };

  return deleteSubjectById;
};

export default useDeleteSubject;
