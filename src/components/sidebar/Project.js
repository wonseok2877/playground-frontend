import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { EDIT_SUBJECT_MUTATION } from "../../graphql/mutation";
import { GET_SUBJECT_QUERY } from "../../graphql/query";
import { useAdminCheck } from "../../hooks/query";
import useProjectQuery from "../../hooks/query/useProjectQuery";
import Containers from "./Containers";
import CreateSubject from "./CreateSubject";

const Project = ({ projectId }) => {
  console.log("project component rendered.");
  // useHistory
  const history = useHistory();
  // useParams
  // ? : 지금 너무 미개하다. projectId는 props로 받아오고 다른 id는 params에서 가져온다고?
  const { subjectId, containerId } = useParams();
  // useState
  const [openedSubjectList, setOpenedSubjectList] = useState([]);
  const [whichSubjectToModifyTitle, setWhichSubjectToModifyTitle] = useState(0);
  const [titleText, setTitleText] = useState("");

  // useQuery
  // Hook 실행
  useAdminCheck();
  const { loadingProject, projectData, refetchProject } = useProjectQuery(
    Number(projectId)
  );

  // useMutation
  const [editSubject] = useMutation(EDIT_SUBJECT_MUTATION);

  // useEffect
  useEffect(() => {
    console.log(projectData);
  }, [projectData]);
  // 변수 정의
  let clickCount = 0;
  // 함수 객체 정의
  const eventHandler = {
    // onClick
    subjectClick: (subjectId) => {
      clickCount++;
      // setTimeOut
      window.setTimeout(() => {
        console.log(clickCount);
        // ! : 1초라는 timeout동안 clickCount가 변하는구나. 그래서 함수에서 clickCount를 올렸어도, setTimeOut안에서는 clickCount가 바뀐대로 바로 적용되는 것. call back!
        if (clickCount <= 0) {
          return;
        } else if (clickCount > 1) {
          const { title } = projectData.project.result.subjects.find(
            (item) => item.id === subjectId
          );
          console.log("double clicked.");
          // setState
          setWhichSubjectToModifyTitle(subjectId);
          setTitleText(title);
          clickCount = 0;
          // else : 한 번 눌렀다고 간주하는 경우
        } else {
          // 조건문 : 현재 열려있냐 아니냐에 따라서 토글 기능
          if (openedSubjectList.includes(subjectId)) {
            setOpenedSubjectList((prev) =>
              prev.filter((item) => item !== subjectId)
            );
          } else {
            setOpenedSubjectList((prev) => [...prev, subjectId]);
          }
          clickCount = 0;
        }
      }, 250);
    },
    // onChange
    subjectTitleChange: ({ target: { value } }) => {
      setTitleText(value);
    },
    // onSubmit
    subjectTitleSubmit: async (event) => {
      event.preventDefault();
      // try & catch block
      try {
        // mutation
        const { data } = await editSubject({
          variables: {
            input: {
              projectId,
              subjectId: whichSubjectToModifyTitle,
              title: titleText,
            },
          },
        });
        console.log(data);
        // refetch
        await refetchProject();
      } catch (error) {
        console.log(error);
      } finally {
        // setState : initiallize
        setWhichSubjectToModifyTitle(0);
      }
    },
    // onBlur
    subjectTitleBlur: () => {
      // setState : initiallize
      setWhichSubjectToModifyTitle(0);
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
                <div
                  onClick={() => eventHandler.subjectClick(subjectItem.id)}
                  className="flex items-center mb-1"
                >
                  <i
                    className={`fas ${
                      openedSubjectList.includes(subjectItem.id)
                        ? "fa-angle-down"
                        : "fa-angle-right"
                    } text-base mr-2`}
                  />
                  <div className="cursor-default">
                    <i className="fas fa-book text-base mr-2"></i>
                    {whichSubjectToModifyTitle === subjectItem.id ? (
                      <form onSubmit={eventHandler.subjectTitleSubmit}>
                        <input
                          value={titleText}
                          onChange={eventHandler.subjectTitleChange}
                          onBlur={eventHandler.subjectTitleBlur}
                          autoFocus
                          spellCheck="false"
                        />
                      </form>
                    ) : (
                      <span
                        className={`text-xl
                    ${
                      Number(subjectId) === subjectItem.id
                        ? "text-yellow-300"
                        : "text-white"
                    } `}
                      >
                        {subjectItem.title}
                      </span>
                    )}
                  </div>
                </div>
                {openedSubjectList.includes(subjectItem.id) && (
                  <div className="ml-5 flex flex-col">
                    <Containers
                      projectId={projectId}
                      containerId={containerId}
                      subject={subjectItem}
                    />
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
