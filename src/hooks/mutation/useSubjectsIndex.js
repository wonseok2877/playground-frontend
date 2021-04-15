import { useMutation } from "@apollo/client";
import { CONTAINERS_INDEX_MUTATION } from "../../graphql/mutation";

const useSubjectsIndex = (projectId, subjectsIndex) => {
  const [changeContainersIndex] = useMutation(CONTAINERS_INDEX_MUTATION);
  return { changeContainersIndex };
};

export default useSubjectsIndex;
