import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EDIT_SUBJECT_MUTATION } from "../../graphql/mutation";
import { GET_SUBJECT_QUERY } from "../../graphql/query";
import { useAdminCheck } from "../../hooks/query";
import useProjectQuery from "../../hooks/query/useProjectQuery";
import CreateSubject from "./CreateSubject";

const Project = ({ projectId }) => {
  console.log("project component rendered.");
  // useParams
  // ? : 지금 너무 미개하다. projectId는 props로 받아오고 다른 id는 params에서 가져온다고?
  const { subjectId, containerId } = useParams();
  // useState
  const [openedSubjectList, setOpenedSubjectList] = useState([]);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");

  // useQuery
  // Hook 실행
  useAdminCheck();
  const { loadingProject, projectData, refetchProject } = useProjectQuery(
    Number(projectId)
  );

  // useMutation
  const [editSubject] = useMutation(EDIT_SUBJECT_MUTATION);

  // 함수 객체 정의
  const eventHandler = {
    subjectClick: (subjectId) => {
      openedSubjectList.includes(subjectId)
        ? setOpenedSubjectList((prev) =>
            prev.filter((item) => item !== subjectId)
          )
        : setOpenedSubjectList((prev) => [...prev, subjectId]);
    },
  };

  return (
    <div>
      <div className="w-full ml-3 flex flex-col justify-evenly items-start">
        {loadingProject
          ? null
          : projectData?.project.result?.subjects.map((subjectItem, index) => (
              <div
                key={index}
                className="w-5/6 mb-2 flex flex-col justify-center"
              >
                <div className="flex items-center mb-1">
                  <i
                    onClick={() => eventHandler.subjectClick(subjectItem.id)}
                    className={`fas ${
                      openedSubjectList.includes(subjectItem.id)
                        ? "fa-angle-down"
                        : "fa-angle-right"
                    } text-base mr-2`}
                  />
                  <Link
                    to={`/project/${projectId}/subject/${subjectItem.id}/${
                      subjectItem.containers_index.split(",")[0]
                    }`}
                  >
                    <i className="fas fa-book text-base mr-2"></i>
                    <span
                      className={`text-xl hover:underline 
                    ${
                      Number(subjectId) === subjectItem.id
                        ? "text-yellow-300"
                        : "text-white"
                    } `}
                    >
                      {subjectItem.title}
                    </span>
                  </Link>
                </div>
                {openedSubjectList.includes(subjectItem.id) && (
                  <div className="ml-5 flex flex-col">
                    {subjectItem.containers_index
                      .split(",")
                      .map((containerItem, index) => (
                        <Link
                          to={`/project/${projectId}/subject/${subjectItem.id}/${containerItem}`}
                          key={index}
                          className={`hover:underline ${
                            containerId === containerItem
                              ? "text-yellow-300"
                              : "text-white"
                          }`}
                        >
                          <i className="far fa-sticky-note text-base mr-2"></i>
                          <span>{containerItem}</span>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
        <CreateSubject projectId={projectId} refetchProject={refetchProject} />
      </div>
    </div>
  );
};

export default Project;
