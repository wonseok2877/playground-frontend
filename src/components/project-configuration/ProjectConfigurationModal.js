import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  DELETE_PROJECT_MUTATION,
  EDIT_PROJECT_MUTATION,
} from "../../graphql/mutation";

const ConfigurationModal = ({
  projectItem,
  refetchProjects,
  setWhichModalOpen,
}) => {
  console.log(projectItem);
  // useState
  const [titleText, setTitleText] = useState("");
  const [goalText, setGoalText] = useState("");
  // useMutation
  const [editProject] = useMutation(EDIT_PROJECT_MUTATION, {
    variables: {
      input: {
        title: titleText,
        goal: goalText,
        projectId: projectItem.id,
      },
    },
  });
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION);
  //   useEffect
  useEffect(() => {
    if (projectItem.title) {
      setTitleText(projectItem.title);
    }
    if (projectItem.goal) {
      setGoalText(projectItem.goal);
    }
  }, [projectItem]);
  // 변수 정의 : event handler object
  const eventHandler = {
    closeModalClick: () => {
      setWhichModalOpen(false);
    },
    deleteProjectClick: async (projectId) => {
      const { data } = await deleteProject({
        variables: {
          input: {
            projectId,
          },
        },
      });
      console.log(data);
      refetchProjects();
    },
    saveConfigutationCLick: async () => {
      console.log("clicked.");
      if (titleText !== projectItem.title || goalText !== projectItem.goal) {
        const { data } = await editProject();
        console.log(data);
      }
    },
    titleTextChange: (event) => {
      setTitleText(event.target.value);
    },
    goalTextChange: (event) => {
      setGoalText(event.target.value);
    },
  };

  return (
    <div>
      <div
        onClick={eventHandler.closeModalClick}
        className="fixed z-40 right-0 top-0  w-screen h-screen bg-black bg-opacity-60"
      ></div>
      <div className="p-4 fixed z-50 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 top-1/2 left-1/2 flex flex-col justify-between bg-white">
        <div>
          <div>
            <h1 className="mb-2 text-xl">프로젝트 이름</h1>
            <input
              value={titleText}
              onChange={eventHandler.titleTextChange}
              className="p-4 bg-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <h1 className="mb-2 text-xl">프로젝트 목표</h1>
            <input
              value={goalText}
              onChange={eventHandler.goalTextChange}
              className="p-4 bg-gray-700 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div
            onClick={eventHandler.saveConfigutationCLick}
            className="flex items-center cursor-pointer text-green-600"
          >
            <i className="fas fa-check text-4xl"></i>
            <span>저장</span>
          </div>
          <div
            onClick={() => eventHandler.deleteProjectClick(projectItem.id)}
            className="flex justify-center items-center cursor-pointer text-red-500"
          >
            <i className="fas fa-trash text-4xl "></i>
            프로젝트 삭제
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationModal;
