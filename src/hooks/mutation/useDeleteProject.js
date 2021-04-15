import { useMutation } from "@apollo/client";
import React from "react";
import { DELETE_PROJECT_MUTATION } from "../../graphql/mutation";

const useDeleteProject = (projectId) => {
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    variables: {
      input: {
        projectId,
      },
    },
  });
  return { deleteProject };
};

export default useDeleteProject;
