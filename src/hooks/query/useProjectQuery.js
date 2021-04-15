import { useQuery } from "@apollo/client";
import { GET_PROJECT_QUERY } from "../../graphql/query";

const useProjectQuery = (projectId) => {
  const {
    loading: loadingProject,
    data: projectData,
    refetch: refetchProject,
  } = useQuery(GET_PROJECT_QUERY, {
    variables: {
      input: {
        projectId,
      },
    },
  });

  return { loadingProject, projectData, refetchProject };
};
export default useProjectQuery;
