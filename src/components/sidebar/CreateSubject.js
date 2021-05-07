import { useState } from "react";
import { useCreateSubject } from "../../hooks/mutation";

const CreateSubject = ({ projectId, refetchProject }) => {
  // useState
  const [titleText, setTitleText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [isModified, setIsModified] = useState(false);
  // Hook : mutation
  const { createSubject } = useCreateSubject(+projectId, titleText, goalText);

  // 함수 정의 : onSubmit event
  const createSubjectSubmit = async (event) => {
    event.preventDefault();
    try {
      const {
        data: {
          createSubject: { error, ok, subject },
        },
      } = await createSubject();
      if (ok) {
        console.log(subject);
        // refetch
        await refetchProject();
        // setState : initiallize
        setTitleText("");
        setGoalText("");
      } else if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsModified(false);
    }
  };
  return (
    <>
      {isModified ? (
        <form
          onSubmit={(e) => createSubjectSubmit(e)}
          onBlur={(e) => console.log(e)}
          className="flex flex-col "
        >
          <div className="flex ">
            <input
              value={titleText}
              onChange={(event) => setTitleText(event.target.value)}
              className="bg-transparent focus:outline-none text-2xl"
              style={{ fontFamily: "Do Hyeon, sans-serif" }}
              autoFocus
              placeholder="서브젝트 이름"
            />
            <input
              value={goalText}
              onChange={(event) => setGoalText(event.target.value)}
              className="bg-transparent focus:outline-none text-2xl"
              placeholder="목표 설정"
            />
          </div>
          <div>
            <button
              type="submit"
              className="p-2 rounded bg-blue-500 focus:outline-none"
            >
              생성
            </button>
            <button
              onClick={() => {
                setIsModified(false);
                setTitleText("");
              }}
              className="p-2 rounded bg-gray-500 focus:outline-none"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsModified(true)}
          className=" flex justify-center items-center text-2xl rounded"
        >
          <i className="fas fa-plus text-xl mr-2"></i>
        </button>
      )}
    </>
  );
};

export default CreateSubject;
