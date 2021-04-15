import { useQuery } from "@apollo/client";
import { GET_SUBJECTS_QUERY } from "../../graphql/query";

const useSubjectsQuery = (page = 1) => {
  // useQuery
  const {
    loading: loadingSubjects,
    data: subjectsData,
    error: subjectsError,
    refetch: refetchAllSubjects,
  } = useQuery(GET_SUBJECTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  return { loadingSubjects, subjectsError, subjectsData, refetchAllSubjects };
};

export default useSubjectsQuery;
