import { useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { GET_PROJECTS_QUERY } from "../graphql/query";
import { useAdminCheck } from "../hooks/query";

const Main = () => {
  // Hook
  useAdminCheck();
  // Hook
  const { loading: loadingProjects, error, data: projectsData } = useQuery(
    GET_PROJECTS_QUERY,
    {
      variables: {
        input: {
          page: 1,
        },
      },
    }
  );
  console.log(projectsData);
  return (
    <>
      <div className="w-full">
        <Link
          to="/project/create"
          className="flex justify-center items-center text-2xl w-3/12 h-20 bg-green-600"
        >
          <span>프로젝트 생성</span>
        </Link>
        {loadingProjects
          ? null
          : projectsData?.projects.results.map((item, index) => (
              <Link to={`/project/${item.id}`} key={index}>
                <span>{item.title}</span>
                <span>{item.goal}</span>
              </Link>
            ))}
      </div>
    </>
  );
};

export default Main;
