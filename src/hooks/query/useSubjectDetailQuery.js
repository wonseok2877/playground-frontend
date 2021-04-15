import { useQuery } from "@apollo/client";
import { GET_SUBJECT_QUERY } from "../../graphql/query";

const useSubjectDetailQuery = (subjectId, containerTitle) => {
  //   useLazyQuery
  const {
    loading: loadingSubject,
    data: subjectData,
    refetch: refetchSubject,
  } = useQuery(GET_SUBJECT_QUERY, {
    variables: {
      input: {
        subjectId,
        containerTitle,
      },
    },
  });
  return { loadingSubject, subjectData, refetchSubject };
};

export default useSubjectDetailQuery;
