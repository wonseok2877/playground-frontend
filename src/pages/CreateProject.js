import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useHistory } from "react-router";
import NavBar from "../components/NavBar";
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
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-200 mt-16">
        <form onSubmit={handleSubmit} className="">
          <div className=" flex flex-col justify-between bg-white">
            <input
              value={title}
              onChange={handleTitleChange}
              className="h-12 pl-3 py-8 text-2xl"
              style={{ fontFamily: "RixYeoljeongdo_Regular, sans-serif" }}
              placeholder="title"
            />
            <input
              value={goal}
              onChange={handleGoalChange}
              className="h-12 pl-3 py-8 text-2xl"
              placeholder="goal"
            />
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
