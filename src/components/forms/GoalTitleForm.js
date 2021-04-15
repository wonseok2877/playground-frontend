import React from "react";

const GoalTitleForm = ({
  state: { isGoalSelected, goalTitle, goalErrorMessage },
  eventHandler: {
    goalTitleSubmit,
    goalTitleChange,
    goalTitleEditClick,
    goalTitleBlur,
  },
  dispatch,
  projectQueryResult,
}) => {
  return (
    <div className="mt-5 text-4xl">
      {isGoalSelected ? (
        <form onSubmit={(e) => goalTitleSubmit(e)}>
          <input
            value={goalTitle}
            onChange={(e) => goalTitleChange(e.target.value)}
            autoFocus={isGoalSelected ? true : false}
            onBlur={() => dispatch({ type: "isGoalSelected", payload: false })}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                dispatch({
                  type: "goalTitle",
                  payload: projectQueryResult.title,
                });
                dispatch({ type: "isGoalSelected", payload: false });
              }
            }}
            className=" bg-transparent focus:outline-none"
          />
          <span className="bg-purple-400">{goalErrorMessage}</span>
        </form>
      ) : (
        <div className="flex justify-between">
          <span onClick={() => goalTitleEditClick()} className="cursor-pointer">
            {projectQueryResult.goal}
          </span>
        </div>
      )}
    </div>
  );
};

export default GoalTitleForm;
