import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GET_PROJECTS_QUERY } from "../graphql/query";
import { useAdminCheck } from "../hooks/query";
import Project from "./Project";
import ProjectConfigurationModal from "../project-configuration/ProjectConfigurationModal";
import NavBar from "../components/NavBar";

const Main = () => {
  const [whichModalOpen, setWhichModalOpen] = useState([]);
  const [openedList, setOpenedList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // Hook
  useAdminCheck();
  // useQuery
  const {
    loading: loadingProjects,
    error: projectError,
    data: projectsData,
    refetch: refetchProjects,
  } = useQuery(GET_PROJECTS_QUERY, {
    variables: {
      input: {
        page: currentPage,
      },
    },
  });
  // 변수 정의 : event handler 객체
  const eventHandler = {
    openProjectDetailClick: (projectId) => {
      setOpenedList((prev) => prev.filter((item) => item !== projectId));
    },
    closeProjectDetailClick: (projectId) => {
      setOpenedList((prev) => [...prev, projectId]);
    },
  };
  // 변수 정의 : array
  let pageArray = [];
  // loop : total page 수만큼 push
  for (let i = 0; i < projectsData?.projects.totalPages; i++) {
    pageArray.push(i + 1);
  }
  console.log(pageArray);
  return (
    <>
      <div className="w-full min-h-screen bg-gray-200">
        <NavBar />
        <div className="p-5 flex flex-col justify-between">
          <div>
            <Link
              to="/project/create"
              className="w-48 h-12 px-4 mb-5 flex justify-center items-center text-base rounded bg-green-500"
            >
              <i className="fas fa-book mr-2 text-xl"></i>
              <span>프로젝트 생성</span>
            </Link>
            {loadingProjects
              ? null
              : projectsData?.projects.results.map((projectItem, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between bg-indigo-300">
                      <div className="pl-2 flex items-center">
                        {openedList.find((item) => item === projectItem.id) ? (
                          <i
                            className="far fa-caret-square-up text-xl cursor-pointer"
                            onClick={() =>
                              eventHandler.openProjectDetailClick(
                                projectItem.id
                              )
                            }
                          />
                        ) : (
                          <i
                            className="far fa-caret-square-down text-xl cursor-pointer"
                            onClick={() =>
                              eventHandler.closeProjectDetailClick(
                                projectItem.id
                              )
                            }
                          />
                        )}

                        <h1
                          style={{
                            fontFamily: "RixYeoljeongdo_Regular, sans-serif",
                            fontSize: "70px",
                            cursor: "default",
                            marginLeft: "10px",
                          }}
                        >
                          {projectItem.title}
                        </h1>
                        <h1>{projectItem.goal}</h1>
                      </div>
                      <i
                        className="fas fa-edit"
                        onClick={() => setWhichModalOpen(projectItem.id)}
                      ></i>
                      {whichModalOpen === projectItem.id && (
                        <ProjectConfigurationModal
                          projectItem={projectItem}
                          refetchProjects={refetchProjects}
                          setWhichModalOpen={setWhichModalOpen}
                        />
                      )}
                    </div>
                    {openedList.includes(projectItem.id) && (
                      <Project projectId={projectItem.id} />
                    )}
                  </div>
                ))}
          </div>
          <div className=" w-11/12 mt-8 flex justify-center items-center">
            {projectsData?.projects.totalPages > 1 && currentPage > 1 ? (
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="focus:outline-none cursor-default"
              >
                이전
              </button>
            ) : (
              <span className="opacity-50 cursor-default">이전</span>
            )}
            <div className="mx-4 text-xl">
              {pageArray.map((item, index) => (
                <span
                  onClick={() => setCurrentPage(item)}
                  className={`px-2 border-b-2 border-black border-opacity-0 transition-all ease-in-out duration-300 ${
                    currentPage === item
                      ? "border-opacity-100 cursor-default"
                      : "cursor-pointer"
                  }`}
                  key={index}
                >
                  {item}
                </span>
              ))}
            </div>
            {projectsData?.projects.totalPages > 1 &&
            projectsData?.projects.totalPages - currentPage > 0 ? (
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="focus:outline-none cursor-default"
              >
                다음
              </button>
            ) : (
              <span className="opacity-50 cursor-default">다음</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
