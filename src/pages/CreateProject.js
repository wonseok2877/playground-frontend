import React, { useState } from "react";
import { useCreateProject } from "../hooks/mutation";

// project 생성 page
const CreateProject = () => {
  // useState
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  // hook : mutation
  const createProject = useCreateProject(title, goal);

  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleGoalChange = (event) => setGoal(event.target.value);
  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      createProject();
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={handleTitleChange} placeholder="title" />
        <input value={goal} onChange={handleGoalChange} placeholder="goal" />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default CreateProject;
