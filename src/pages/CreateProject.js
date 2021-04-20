import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { GET_PROJECTS_QUERY } from "../graphql/query";
import { useCreateProject } from "../hooks/mutation";

// project 생성 page
const CreateProject = () => {
  // useHistory
  const history = useHistory();
  // useState
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  // useQuery
  const { data: projectsData, refetch: refetchProjects } = useQuery(
    GET_PROJECTS_QUERY,
    {
      variables: {
        input: {
          page: 1,
        },
      },
    }
  );
  // hook : mutation
  const createProject = useCreateProject(title, goal);

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleGoalChange = (event) => setGoal(event.target.value);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createProject();
      console.log(data);
      await refetchProjects();
      // push method
      history.push("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-200 ">
      <form onSubmit={handleSubmit} className="">
        <div className=" flex flex-col justify-between bg-white">
          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="title"
            className="h-12 pl-3 py-8 text-2xl"
            style={{ fontFamily: "RixYeoljeongdo_Regular, sans-serif" }}
          />
          <input
            value={goal}
            onChange={handleGoalChange}
            placeholder="goal"
            className="h-12 pl-3 py-8 text-2xl"
          />
          <button type="submit">submit</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
