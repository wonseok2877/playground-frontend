const CreateSubject = ({
  state: { subjectText, goalText, isModified },
  dispatch,
  createProjectSubmit,
}) => {
  return (
    <>
      {isModified ? (
        <form onSubmit={(e) => createProjectSubmit(e)}>
          <input
            value={subjectText}
            onChange={(e) =>
              dispatch({ type: "subjectText", payload: e.target.value })
            }
            placeholder="서브젝트 이름"
          />
          <input
            value={goalText}
            onChange={(e) =>
              dispatch({ type: "goalText", payload: e.target.value })
            }
            placeholder="목표 설정"
          />
          <button type="submit">제출</button>
          <button
            onClick={() => dispatch({ type: "isModified", payload: false })}
          >
            취소
          </button>
        </form>
      ) : (
        <button
          onClick={() => dispatch({ type: "isModified", payload: true })}
          className="flex justify-center items-center text-2xl w-3/12 h-20 bg-green-600"
        >
          <span>서브젝트 생성</span>
        </button>
      )}
    </>
  );
};

export default CreateSubject;
