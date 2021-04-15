import LargeText from "../texts/LargeText";
import MediumText from "../texts/MediumText";

const ProjectTitleForm = ({
  state: {
    isTitleSelected,
    subjectTitle,
    subjectErrorMessage,
    isGoalSelected,
    goalTitle,
    goalErrorMessage,
  },
  dispatch,
  eventHandler: {
    titleSubmit,
    subjectTitleChange,
    subjectTitleEditClick,
    goalSubmit,
    goalTitleChange,
    goalTitleEditClick,
  },
  subjectQueryResult,
}) => {
  return (
    <div style={{ fontFamily: "Do Hyeon, sans-serif" }}>
      <LargeText>
        <div className="pl-4 py-3">
          {isTitleSelected ? (
            <form onSubmit={(e) => titleSubmit(e)}>
              <input
                value={subjectTitle}
                // autoFocus : focus()함수를 대신 하는건가?
                onChange={(e) => subjectTitleChange(e.target.value)}
                onBlur={() => {
                  dispatch({
                    type: "subjectTitle",
                    payload: subjectQueryResult.title,
                  });
                  dispatch({ type: "isTitleSelected", payload: false });
                }}
                autoFocus={isTitleSelected ? true : false}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    dispatch({
                      type: "subjectTitle",
                      payload: subjectQueryResult.title,
                    });
                    dispatch({ type: "isTitleSelected", payload: false });
                  }
                }}
                className="bg-transparent focus:outline-none"
                spellCheck="false"
              />
              {subjectErrorMessage && (
                <span className="bg-purple-400">{subjectErrorMessage}</span>
              )}
            </form>
          ) : (
            <div>
              <span
                onClick={() => subjectTitleEditClick()}
                className="cursor-pointer"
              >
                {subjectQueryResult.title}
              </span>
            </div>
          )}
        </div>
      </LargeText>
      <MediumText>
        <div className="pl-4 py-2">
          {isGoalSelected ? (
            <form onSubmit={(e) => goalSubmit(e)}>
              <input
                value={goalTitle}
                onChange={(e) => goalTitleChange(e.target.value)}
                autoFocus={isGoalSelected ? true : false}
                onBlur={() => {
                  dispatch({
                    type: "goalTitle",
                    payload: subjectQueryResult.goal,
                  });
                  dispatch({ type: "isGoalSelected", payload: false });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    dispatch({
                      type: "goalTitle",
                      payload: subjectQueryResult.goal,
                    });
                    dispatch({ type: "isGoalSelected", payload: false });
                  }
                }}
                className=" bg-transparent focus:outline-none"
                placeholder="새 목표"
                spellCheck="false"
              />
              <span className="bg-purple-400">{goalErrorMessage}</span>
            </form>
          ) : (
            <div className="">
              <span
                onClick={() => goalTitleEditClick()}
                className="cursor-pointer"
              >
                {subjectQueryResult.goal ? subjectQueryResult.goal : "목표"}
              </span>
            </div>
          )}
        </div>
      </MediumText>
    </div>
  );
};

export default ProjectTitleForm;
