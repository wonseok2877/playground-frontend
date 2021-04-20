import { Link } from "react-router-dom";
import { useAdminCheck } from "../hooks/query";
import useProjectQuery from "../hooks/query/useProjectQuery";
import CreateSubject from "./CreateSubject";

const Project = ({ projectId }) => {
  // Hook : 다른 페이지 reducer 형태만 가져옴

  // Hook 실행
  useAdminCheck();

  const { loadingProject, projectData, refetchProject } = useProjectQuery(
    +projectId
  );

  return (
    <div>
      <div className="w-full p-2 flex flex-col justify-evenly items-start bg-indigo-200">
        {loadingProject
          ? null
          : projectData?.project.result?.subjects.map((subjectItem, index) => (
              <div
                key={index}
                className="w-5/6 mb-5 flex flex-col justify-center"
              >
                <div className="flex items-center mb-3">
                  <i className="far fa-sticky-note text-xl mr-2"></i>

                  <Link
                    to={`/project/${projectId}/subject/${subjectItem.id}/${
                      subjectItem.containers_index.split(",")[0]
                    }`}
                  >
                    <span
                      className="text-3xl hover:underline"
                      style={{
                        fontFamily: "Do Hyeon, sans-serif",
                        textDecorationThickness: "2px",
                      }}
                    >
                      {subjectItem.title}
                    </span>
                  </Link>
                </div>
                <span>{subjectItem.goal}</span>
                <div>
                  {subjectItem.containers_index
                    .split(",")
                    .map((containerItem, index) => (
                      <Link
                        to={`/project/${projectId}/subject/${subjectItem.id}/${containerItem}`}
                        key={index}
                        className="mx-3 p-2 rounded bg-gray-600 text-yellow-300"
                      >
                        <span>{containerItem}</span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
        <CreateSubject projectId={projectId} refetchProject={refetchProject} />
      </div>
    </div>
  );
};

export default Project;
