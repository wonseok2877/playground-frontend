import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { EDIT_SUBJECT_MUTATION } from "../../graphql/mutation";

// 함수 정의 : component
const SubjectTitleForm = ({ subjectData, refetchSubject }) => {
  // useParams
  const { projectId, subjectId } = useParams();
  // useState
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isGoalFocused, setIsGoalFocused] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [goalText, setGoalText] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [goalErrorMessage, setGoalErrorMessage] = useState("");
  // useMutation
  const [editSubject] = useMutation(EDIT_SUBJECT_MUTATION);
  // 변수 정의 : project Query문의 핵심 data
  const { result } = subjectData?.subject;
  // useEffect : Query data
  useEffect(() => {
    // if : input value로 goalTitle이 들어가기 때문에, data가 null인 경우엔 initial state대로.
    if (result.title) {
      setTitleText(result.title);
    }
    if (result.goal) {
      setGoalText(result.goal);
    }
  }, [result]);

  const eventHandler = {
    // onChange
    titleTextChange: (event) => {
      setTitleText(event.target.value);
    },
    goalTextChange: (event) => {
      setGoalText(event.target.value);
    },
    // 함수 정의 : onClick event 함수
    titleTextEditClick: () => {
      //  setState
      setIsTitleFocused(true);
    },
    goalTextEditClick: () => {
      // setState
      setIsGoalFocused(true);
    },
    // onSubmit
    titleSubmit: async (event) => {
      event.preventDefault();
      // if : state가 data가 같을 경우, 즉 아무 변화가 없을 경우엔 그냥 인풋창을 닫는다.
      if (titleText === result.title) {
        setIsTitleFocused(false);
        return;
      }
      // try & catch
      try {
        const { data } = await editSubject({
          variables: {
            input: {
              projectId: +projectId,
              subjectId: +subjectId,
              title: titleText,
            },
          },
        });
        if (!data.editSubject.ok) {
          throw new Error(data.editSubject.error);
        }
        refetchSubject();
        setIsTitleFocused(false);
      } catch (error) {
        setTitleErrorMessage(error.message);
      }
    },
    goalSubmit: async (event) => {
      event.preventDefault();
      if (goalText === result.goal) {
        setIsGoalFocused(false);
        return;
      }
      // try & catch
      try {
        const { data } = await editSubject({
          variables: {
            input: {
              projectId: +projectId,
              subjectId: +subjectId,
              goal: goalText,
            },
          },
        });
        if (!data.editSubject.ok) {
          throw new Error(data.editSubject.error);
        }
        refetchSubject();
        setIsGoalFocused(false);
      } catch (error) {
        setGoalErrorMessage(error.message);
      }
    },
  };

  return (
    <div style={{ fontFamily: "Do Hyeon, sans-serif" }}>
      <div className="text-6xl mb-3">
        <div className="pl-4 py-3">
          {isTitleFocused ? (
            <form onSubmit={eventHandler.titleSubmit}>
              <input
                value={titleText}
                // autoFocus : focus()함수를 대신 하는건가?
                onChange={eventHandler.titleTextChange}
                onBlur={() => {
                  setTitleText(result.title);
                  setIsTitleFocused(false);
                }}
                autoFocus={isTitleFocused ? true : false}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setTitleText(result.title);
                    setIsTitleFocused(false);
                  }
                }}
                className="bg-transparent focus:outline-none"
                spellCheck="false"
              />
              {titleErrorMessage && (
                <span className="bg-purple-400">{titleErrorMessage}</span>
              )}
            </form>
          ) : (
            <div>
              <span
                onClick={eventHandler.titleTextEditClick}
                className="cursor-pointer"
              >
                {result.title}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="text text-3xl">
        <div className="pl-4 py-2">
          {isGoalFocused ? (
            <form onSubmit={eventHandler.goalSubmit}>
              <input
                value={goalText}
                onChange={eventHandler.goalTextChange}
                autoFocus={isGoalFocused ? true : false}
                onBlur={() => {
                  result.goal && setGoalText(result.goal);
                  setIsGoalFocused(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    result.goal && setGoalText(result.goal);
                    setIsGoalFocused(false);
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
                onClick={eventHandler.goalTextEditClick}
                className="cursor-pointer"
              >
                {result.goal ? result.goal : "목표"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectTitleForm;
