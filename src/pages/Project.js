import { Link, useHistory, useParams } from "react-router-dom";
import { useCreateSubject } from "../hooks/mutation";
import { useAdminCheck } from "../hooks/query";
import useProjectQuery from "../hooks/query/useProjectQuery";
import useProjectReducer from "../hooks/reducer/useProjectReducer";
import CreateSubject from "./CreateSubject";

const Project = () => {
  const { projectId } = useParams();
  // Hook : 다른 페이지 reducer 형태만 가져옴
  const { state, dispatch } = useProjectReducer();
  const { subjectText, goalText, isModified } = state;
  const history = useHistory();
  // Hook 실행
  useAdminCheck();

  const { loadingProject, projectData, refetchProject } = useProjectQuery(
    +projectId
  );

  if (loadingProject) console.log("loadingProject..");
  else console.log(projectData);
  // Hook
  const { createSubject } = useCreateSubject(+projectId, subjectText, goalText);

  // 함수 정의 : onSubmit event
  const createProjectSubmit = async (event) => {
    event.preventDefault();
    try {
      const {
        data: {
          createSubject: { error, ok, subject },
        },
      } = await createSubject();
      if (ok) {
        console.log(subject);
      }
      if (error) {
        throw new Error(error);
      }
      await refetchProject();
    } catch (error) {
      console.log(error.message);
    } finally {
      dispatch({ type: "isModified", payload: false });
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-evenly items-center h-5/6 w-full">
        <CreateSubject
          state={state}
          dispatch={dispatch}
          createProjectSubmit={createProjectSubmit}
        />

        {loadingProject
          ? null
          : projectData?.project.result?.subjects.map((s, index) => (
              <div key={index} className="min-h-0 w-5/6 bg-indigo-500">
                <h2 className="text-4xl">{s.title}</h2>
                <span>{s.goal}</span>
                {s.containers_index.split(",").map((c, index) => (
                  <Link
                    to={`/project/${projectId}/subject/${s.id}/${c}`}
                    key={index}
                  >
                    <span className="mx-4 bg-yellow-500">{c}</span>
                  </Link>
                ))}
              </div>
            ))}

        {/* <div>
          {page <= 1 ? null : (
            <button
              onClick={(e) => {
                setPage((prev) => prev - 1);
              }}
            >
              👈
            </button>
          )}
          <span>{page}</span>
          {data && page >= data.project.totalPages ? null : (
            <button
              onClick={(e) => {
                setPage((prev) => prev + 1);
              }}
            >
              👉
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Project;
