import { useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GET_PROJECTS_QUERY } from "../../graphql/query";
import { useAdminCheck } from "../../hooks/query";
import Project from "./Project";
import ProjectConfigurationModal from "../project-configuration/ProjectConfigurationModal";
import { stateContext } from "../../context/stateContext";

const SideBar = () => {
  // useState
  const [whichModalOpen, setWhichModalOpen] = useState([]);
  const [openedList, setOpenedList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // useContext
  const { isSideBarOpen, setIsSideBarOpen } = useContext(stateContext);
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
    openSideBarClick: () => {
      if (isSideBarOpen) {
        setIsSideBarOpen(false);
      } else {
        setIsSideBarOpen(true);
      }
    },
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
  return (
    <>
      <div>
        <button
          onClick={eventHandler.openSideBarClick}
          style={{ color: isSideBarOpen ? "white" : "#032F38" }}
          className="z-40 fixed top-12 ml-4 text-4xl focus:outline-none transition-colors ease-in-out duration-500"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      <div
        className={`z-30 fixed h-screen top-0 w-60 pt-20 px-2 bg-gray-200 text-gray-300 
        ${
          isSideBarOpen
            ? "transform translate-x-0"
            : "transform -translate-x-60 "
        } transition-transform ease-in-out duration-500`}
        style={{
          backgroundColor: "#032F38",
        }}
      >
        <div className="px-2 py-5 flex flex-col ">
          <div>
            <Link
              to="/project/create"
              className="w-24 px-4 py-1 mb-3 flex justify-center items-center text-base rounded text-black bg-green-500"
            >
              <i className="fas fa-box mr-2 text-xl"></i>
              <span>New</span>
            </Link>
            {loadingProjects
              ? null
              : projectsData?.projects.results.map((projectItem, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {openedList.find((item) => item === projectItem.id) ? (
                          <div>
                            <i
                              className="fas fa-angle-down text-lg cursor-pointer"
                              onClick={() =>
                                eventHandler.openProjectDetailClick(
                                  projectItem.id
                                )
                              }
                            />
                            <i className="fas fa-box-open ml-2"></i>
                          </div>
                        ) : (
                          <div>
                            <i
                              className="fas fa-angle-right text-lg cursor-pointer"
                              onClick={() =>
                                eventHandler.closeProjectDetailClick(
                                  projectItem.id
                                )
                              }
                            />
                            <i className="fas fa-box ml-2"></i>
                          </div>
                        )}
                        <h1
                          style={{
                            fontSize: "20px",
                            cursor: "default",
                            marginLeft: "10px",
                          }}
                        >
                          {projectItem.title}
                        </h1>
                      </div>
                      <i
                        className="fas fa-cog text-sm"
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
          <div className="absolute bottom-10 flex justify-center items-center">
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

export default SideBar;
