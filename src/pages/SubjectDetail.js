import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import MDEditor, { commands } from "@uiw/react-md-editor";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
import {
  DELETE_SUBJECT_MUTATION,
  EDIT_PROJECT_MUTATION,
  EDIT_SUBJECT_MUTATION,
  CONTAINERS_INDEX_MUTATION,
  CREATE_CONTAINER_MUTATION,
  DELETE_CONTAINER_MUTATION,
  EDIT_CONTAINER_MUTATION,
} from "../graphql/mutation";

import {
  useAdminCheck,
  useSubjectDetailQuery,
  useSubjectsQuery,
} from "../hooks/query";
import { useSubjectDetailReducer } from "../hooks/reducer";
import { GoalTitleForm, ProjectTitleForm } from "../components/forms";
import IndexSection from "../components/sections/IndexSection";
import NotFound from "../components/etc/NotFound";
import Loader from "../components/etc/Loader";

// 함수 정의 : component
const SubjectDetail = () => {
  // useParams : id
  const { projectId, subjectId, containerTitle } = useParams();
  // useHistory
  const history = useHistory();
  const location = useLocation();
  // useReducer : 크게 3 종류. 에러메세지, 선택, 타이틀
  const { state, dispatch } = useSubjectDetailReducer();
  const {
    // 상태
    isTitleSelected,
    isGoalSelected,
    isContainerSelected,
    focusedContainer,
    selectedContainerToEdit,
    // 텍스트
    subjectTitle,
    goalTitle,
    newContainerTitle,
    edittedContainerTitle,
    // 에러메세지
    createContainerErrorMessage,
    editSubjectErrorMessage,
  } = state;

  const [isModalOpen, setIsModalOpen] = useState(false);
  // useState
  const [virtualIndex, setVirtualIndex] = useState([]);
  const [draggedText, setDraggedText] = useState("");
  const [contentText, setContentText] = useState("");

  // Hook : 토큰 유효성 검사 Query
  useAdminCheck();
  // Hook : 해당 프로젝트 Query
  const { loadingSubject, subjectData, refetchSubject } = useSubjectDetailQuery(
    +subjectId,
    containerTitle
  );

  const [editSubject] = useMutation(EDIT_SUBJECT_MUTATION);

  const [deleteSubject] = useMutation(DELETE_SUBJECT_MUTATION, {
    variables: {
      input: {
        subjectId: +subjectId,
      },
    },
  });

  const [createContainer] = useMutation(CREATE_CONTAINER_MUTATION, {
    variables: {
      input: {
        subjectId: +subjectId,
        title: newContainerTitle,
      },
    },
  });
  const [editContainer] = useMutation(EDIT_CONTAINER_MUTATION);

  const [deleteContainer] = useMutation(DELETE_CONTAINER_MUTATION);

  // Hook : Subject 수정

  // useMutation
  // ? : event와 직접 연결된 이런 함수들은 Hook으로 만들 방법이 없는걸까?
  const [changeContainersIndex] = useMutation(CONTAINERS_INDEX_MUTATION);

  // useRef. 어떨 때 진짜 필요한지 모르고 있음.
  const containerRefs = useRef([]);

  // 변수 정의 : project Query문의 핵심 data
  const subjectQueryResult = subjectData?.subject.result;
  // 변수 정의 : subjectData에서 받은 string값 목차를 array로 바꿔준다.
  const containersIndex = subjectQueryResult?.containers_index.split(",");
  // 변수 정의 : 클릭 횟수. 여기서 정의할 필요가 있나
  let clickCount = 0;

  // useEffect : 마운팅 단계와 focusedContainer단계
  useEffect(() => {
    // if : subject params가 없을 경우 메인페이지로 push()
    if (!projectId || !subjectId) {
      history.push("/");
      return;
    }
    // if : 현재 선택된 container가 없을 경우 params의 string값으로 setState
    if (!focusedContainer) {
      dispatch({ type: "focusedContainer", payload: containerTitle });
      return;
      // if : 집중하려는 컨테이너가 기존의 params과 달라지는 경우, 즉 선택한 경우 url replace()
    } else if (focusedContainer !== containerTitle) {
      console.log("focused container changed.");
      history.replace(
        `/project/${projectId}/subject/${subjectId}/${focusedContainer}`
      );
      return;
    }
  }, [projectId, subjectId, containerTitle, focusedContainer]);

  // useEffect : location이 바뀔 때마다 hitory의 action에 따라 data를 fetch할지 말지 결정한다.
  useEffect(() => {
    // if : pop혹은 push가 아닌 replace, 즉 같은 페이지 내의 경우. 근데 이 방식은 너무 깨지기 쉽다. 다른 방식은 없을까.
    if (history.action === "REPLACE") {
      // refetch : 지금 data를 바로 렌더링하고 있기 때문에, refetch를 안 해주면 다른 container의 data를 가져온다.
      refetchSubject();
    }
  }, [history, location, refetchSubject]);
  // useEffect : 마운팅 이후 Query문 로딩 단계. dispatch를 최소화하기 위해.
  // useEffect : Query문 요청에 대한 subjectData 값이 바뀔 때마다 미리 state를 바꿔준다.
  useEffect(() => {
    // if : subjectData가 있을 경우에만 실행
    if (subjectQueryResult) {
      // if : textarea의 value가 null이 들어가면 안되도록.
      if (subjectQueryResult.containers[0].content) {
        setContentText(subjectQueryResult.containers[0].content);
      } else {
        setContentText("");
      }
      dispatch({ type: "subjectTitle", payload: subjectQueryResult.title });
      // if : input value로 goalTitle이 들어가기 때문에, data가 null인 경우엔 initial state대로.
      if (subjectQueryResult.goal) {
        dispatch({ type: "goalTitle", payload: subjectQueryResult.goal });
      }
      setVirtualIndex(subjectQueryResult.containers_index.split(","));
    } else {
      return;
    }
  }, [subjectQueryResult, dispatch]);

  //  함수 정의 : 야바위 로직과 Mutation문 함수 호출
  const containersIndexSubmit = async (array) => {
    if (typeof array !== "object") return;

    // 변수 선언 : array 애기들 비교. map 안에서 각각의 애기들을 비교하면 된다.
    // map()과 find() : 하나라도 다른게 있을 경우 false가 array로 들어간다.
    const isDifferent = array.map((newGuy) => {
      const eachGuy = virtualIndex.find((oldGuy) => oldGuy === newGuy);
      if (eachGuy) return false;
      else return true;
    });
    const checkIsRepeated = () => {
      let count = 0;
      array.map((guy) => array.map((gay) => gay === guy && count++));
      return count;
    };
    const repeatCount = checkIsRepeated();
    // if : 둘이 값이 아예 같으면 함수 실행 안함.
    // ? : 왜 array일때는 값이 다른거지? type도 같고 안의 값들도 같은 array인데. 다른 주솟값이기 때문.
    if (virtualIndex.toString() === array.toString()) {
      console.log("요청할 필요가 없음.");
      return;
      // if : 두 array의 길이가 같지 않을때. 즉 어느 한쪽이 부족하거나 더 많을 땐 initialize하고 return.
    } else if (array.length !== virtualIndex.length) {
      console.log("갯수가 안 맞음");
      return;
      // if : array안에 하나라도 true가 있을 경우. 즉 string값이 다를 경우.
    } else if (isDifferent.find((c) => c)) {
      console.log("원래 없던 값");
      return;
      // if : 중복. 서로 같은 숫자가 array 길이보다 길 경우
    } else if (repeatCount > array.length) {
      console.log("중복!");
      return;
    }
    console.log("정상 요청~");
    // try & catch
    try {
      // ! : ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ시발. Mutation에서 이전 state를 input으로 넣는데 어떻게 이게 정상이겠니.
      const { data } = await changeContainersIndex({
        variables: {
          input: {
            subjectId: +subjectId,
            // state가 아닌, 직접 인자값으로 받은 새로운 array값을 넣는다.
            containersIndex: array,
          },
        },
      });
      console.log(data);
      const {
        changeContainersIndex: { error, ok },
      } = data;
      if (error) throw new Error(error);
      if (ok) {
        // ? : refetch 필요한가 필요하지 않은가
        setVirtualIndex(array);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeTranslate = (boxId) => {
    containerRefs.current[boxId].className = containerRefs.current[
      boxId
    ].className
      .split(" ")
      .filter((c) => c !== "opacity-50")
      .join(" ");
  };

  // 객체 정의 : 섹시하게 객체로 만들어준다.
  const eventHandler = {
    //   함수 정의 : onSubmit event 함수
    titleSubmit: async (event) => {
      console.log(event);
      event.preventDefault();
      // if : state가 data가 같을 경우, 즉 아무 변화가 없을 경우엔 그냥 인풋창을 닫는다.
      if (subjectTitle === subjectQueryResult.title) {
        dispatch({ type: "isTitleSelected", payload: false });
        return;
      }
      // try & catch
      try {
        const { data } = await editSubject({
          variables: {
            input: {
              projectId: +projectId,
              subjectId: +subjectId,
              title: subjectTitle,
            },
          },
        });
        if (!data.editSubject.ok) {
          throw new Error(data.editSubject.error);
        }
        refetchSubject();
        dispatch({ type: "isTitleSelected", payload: false });
      } catch (error) {
        dispatch({ type: "projectErrorMessage", payload: error.message });
      }
    },
    goalSubmit: async (event) => {
      event.preventDefault();
      if (goalTitle === subjectQueryResult.goal) {
        dispatch({ type: "isGoalSelected", payload: false });
        return;
      }
      // try & catch
      try {
        const { data } = await editSubject({
          variables: {
            input: {
              projectId: +projectId,
              subjectId: +subjectId,
              goal: goalTitle,
            },
          },
        });
        if (!data.editSubject.ok) {
          throw new Error(data.editSubject.error);
        }
        refetchSubject();
        dispatch({ type: "isGoalSelected", payload: false });
      } catch (error) {
        dispatch({ type: "goalErrorMessage", payload: error.message });
      }
    },
    ContainerSubmit: async (event) => {
      event.preventDefault();
      try {
        const { data } = await createContainer();
        console.log(data);
        if (!data.createContainer.ok) {
          throw new Error(data.createContainer.error);
        } else {
          refetchSubject();
          dispatch({ type: "newContainerTitle", payload: "" });
          dispatch({ type: "isContainerSelected", payload: false });
        }
      } catch (error) {
        dispatch({
          type: "createContainerErrorMessage",
          payload: error.message,
        });
      }
    },
    editContainerSubmit: async (event) => {
      event.preventDefault();
      const isSame = containersIndex.find((t) => t === edittedContainerTitle);
      // if : 기존 data에서 지금 입력하려는 state와 같은게 있을 경우 취소시킴.
      if (isSame !== undefined) {
        dispatch({ type: "selectedContainerToEdit", payload: "" });
        return;
      }
      // try & catch
      try {
        const { data } = await editContainer({
          variables: {
            input: {
              title: selectedContainerToEdit,
              subjectId: +subjectId,
              newTitle: edittedContainerTitle,
            },
          },
        });
        console.log(data);
        // if : 서버쪽에서 ok가 나지 않으면 에러를 던진다.
        if (!data.editContainer.ok) {
          throw new Error(data.editContainer.error);
        }
        refetchSubject();
        dispatch({ type: "selectedContainerToEdit", payload: "" });
        // if : 현재 페이지의 subject 이름을 바꾸려고 하는 경우
        if (focusedContainer === selectedContainerToEdit) {
          dispatch({
            type: "focusedContainer",
            payload: edittedContainerTitle,
          });
          console.log(edittedContainerTitle);
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "editSubjectErrorMessage",
          payload: error.message,
        });
        return;
      }
    },
    editContentSubmit: async (event) => {
      console.log("submit.");
      event.preventDefault();
      try {
        const { data } = await editContainer({
          variables: {
            input: {
              title: focusedContainer,
              subjectId: +subjectId,
              content: contentText,
            },
          },
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
    // 함수 정의 : onClick event 함수
    subjectTitleEditClick: () => {
      // if : 목표쪽이 선택된 상태일 때 목표쪽 state 초기화
      if (isGoalSelected) {
        dispatch({
          type: "goalTitle",
          payload: subjectQueryResult.goal,
        });
        dispatch({ type: "isGoalSelected", payload: false });
      }
      //  setState
      dispatch({ type: "isTitleSelected", payload: true });
    },
    goalTitleEditClick: () => {
      // if : 타이틀이 선택된 상태일 때 프로젝트 타이틀쪽 state 초기화
      if (isTitleSelected) {
        dispatch({
          type: "subjectTitle",
          payload: subjectQueryResult.title,
        });
        dispatch({ type: "isTitleSelected", payload: false });
      }
      // setState
      dispatch({ type: "isGoalSelected", payload: true });
    },
    deleteSubjectClick: async () => {
      try {
        const { data } = await deleteSubject();
        if (data?.deleteSubject.ok) {
          // push() : 메인페이지로
          history.push("/");
        } else {
          throw new Error(data.deleteSubject.error);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    deleteContainerClick: async () => {
      try {
        const { data } = await deleteContainer({
          variables: {
            input: {
              subjectId: +subjectId,
              containerTitle,
            },
          },
        });

        if (data?.deleteContainer.ok) {
          refetchSubject();
        } else {
          throw new Error(data.deleteContainer.error);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    editContainerDoubleClick: (payload) => {
      dispatch({ type: "selectedContainerToEdit", payload });
      dispatch({ type: "edittedContainerTitle", payload });
    },
    focusContainerClick: (payload) => {
      clickCount++;

      setTimeout(() => {
        // ! : 1초라는 timeout동안 clickCount가 변하는구나. 그래서 함수에서 clickCount를 올렸어도, setTimeOut안에서는 clickCount가 바뀐대로 바로 적용되는 것. call back!
        if (clickCount <= 0) {
          return;
        } else if (clickCount > 1) {
          console.log("double clicked.");
          clickCount = 0;
        } else {
          // setState
          dispatch({ type: "focusedContainer", payload });
          clickCount = 0;
          return;
        }
      }, 150);
    },
    cancelEditContainerClick: () => {
      dispatch({ type: "selectedContainerToEdit", payload: "" });
    },
    createContainerClick: () => {
      dispatch({ type: "isContainerSelected", payload: true });
    },
    // 함수 정의 : onChange event 함수
    subjectTitleChange: (payload) => {
      dispatch({
        type: "subjectTitle",
        payload,
      });
    },
    goalTitleChange: (payload) => {
      dispatch({
        type: "goalTitle",
        payload,
      });
    },
    editContainerTitleChange: (payload) => {
      dispatch({
        type: "edittedContainerTitle",
        payload,
      });
    },
    createContainerTitleChange: (payload) => {
      dispatch({
        type: "newContainerTitle",
        payload,
      });
    },
    // 함수 정의 : drag event
    handleDragStart: ({ target }) => {
      // ? : 왜 되지. 페이지안의 다른 것들도 drag해봤는데 딱 innerText만 인식하네.
      setDraggedText(target.innerText);
      // web API : asynchronous를 이용한다.
      setTimeout(() => (target.className += " invisible"), 0);
    },

    handleDragEnd: ({ target }) => {
      // state initialize
      setDraggedText("");
    },
    handleDragOverBox: (event) => {
      // preventDefault() : onDragOver의 디폴트 효과를 막음.
      event.preventDefault();
      // ? : 정말 필요한 함수인지 확인하자.
      event.stopPropagation();
    },
    handleDragDrop: ({ target }) => {
      // id : innerText가 인식이 안 되서 id로 한다. 좋은 방식은 아닌 듯.
      const boxId =
        target.nodeName === "DIV"
          ? Number(target.id)
          : Number(target.parentElement.id);
      console.log(boxId);
      // if : 그 둘이 같은지부터 확인. 만약 같으면 무의미해지므로.
      if (!draggedText) {
        console.log("값이 비어있는뎅");
        return;
      } else if (virtualIndex[boxId] === draggedText) {
        console.log("둘이 같음.");
        return;
        // if : 기존의 array에서 아예 없던 애면 함수 종료.
      } else if (!virtualIndex.find((a) => a === draggedText)) {
        console.log("그런 애 없음.");
        return;
      } else {
        // ... : immutable object 개념. state는 건들면 안된다고 생각하기 때문
        const newArray = [...virtualIndex];
        // splice() : 원래 자리의 string값을  제거한다.
        // indexOf() : 해당 string값의 순서값을 return하는 함수 호출.
        newArray.splice(newArray.indexOf(draggedText), 1);
        // splice() : drag된 string값을 해당 박스의 순서에 밀어 넣는다.
        newArray.splice(boxId, 0, draggedText);
        console.log(newArray);
        containersIndexSubmit(newArray);

        removeTranslate(boxId);
      }
    },
    handleDragEnterBox: (event) => {
      console.log(event.target.id);
      if (!event.target.id) return;
      const boxId = event.target.id;
      containerRefs.current[boxId].className += " opacity-50";
    },
    handleDragLeaveBox: (event) => {
      if (!event.target.id) return;
      const boxId = event.target.id;
      setTimeout(() => removeTranslate(boxId), 1000);
    },
    handleDragOverText: (event) => {},
    handleDragEnterText: (event) => {
      if (!event.relatedTarget?.id) return;
      console.log(event);
      const boxId = event.relatedTarget?.id;
      // ! : setTimeOut으로 div의 onDragLeave의 callstack 뒤에 놓는다.
      setTimeout(
        () => (containerRefs.current[boxId].className += " opacity-50"),
        0
      );
    },
    handleDragLeaveText: (event) => {
      const boxId = Number(event.target.parentElement.id);
      // setTimeOut()
      setTimeout(() => removeTranslate(boxId), 1000);
    },
  };

  const handleChange = (event) => {
    setContentText(event.target.value);
  };
  console.log(contentText);
  const title = {
    name: "title3",
    keyCommand: "title3",
    buttonProps: null,
    icon: <span style={{ padding: "0 5px" }}>Custom Toolbar</span>,
  };
  return (
    <>
      {loadingSubject ? (
        <Loader />
      ) : subjectQueryResult ? (
        <>
          <div className="px-5 pt-7 flex flex-col shadow-2xl bg-gray-200 ">
            <div className="flex justify-between items-start">
              <ProjectTitleForm
                state={state}
                dispatch={dispatch}
                eventHandler={eventHandler}
                subjectQueryResult={subjectQueryResult}
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-3 rounded-full focus:outline-none"
              >
                <i className="fas fa-cog text-4xl text-gray-500"></i>
              </button>
            </div>
            <IndexSection>
              <div className="h-16 flex items-end">
                {virtualIndex?.map((sub, index, array) => {
                  return (
                    <div key={index}>
                      <div
                        // id props에 순서 할당.
                        id={index}
                        onDragOver={eventHandler.handleDragOverBox}
                        onDrop={eventHandler.handleDragDrop}
                        onDragEnter={eventHandler.handleDragEnterBox}
                        onDragLeave={eventHandler.handleDragLeaveBox}
                        className="mr-3 flex justify-center items-center "
                      >
                        {selectedContainerToEdit === sub ? (
                          <form onSubmit={eventHandler.editContainerSubmit}>
                            <input
                              value={edittedContainerTitle}
                              onKeyDown={(e) => {
                                if (e.key === "Escape")
                                  dispatch({
                                    type: "selectedContainerToEdit",
                                    payload: "",
                                  });
                              }}
                              onBlur={() => {
                                dispatch({
                                  type: "selectedContainerToEdit",
                                  payload: "",
                                });
                              }}
                              autoFocus={
                                selectedContainerToEdit === sub ? true : false
                              }
                              onChange={(e) =>
                                eventHandler.editContainerTitleChange(
                                  e.target.value
                                )
                              }
                              className="w-20 bg-transparent focus:outline-none"
                              spellCheck={false}
                            />
                          </form>
                        ) : (
                          <h1
                            ref={(element) =>
                              // []표현으로 array안에다가 순서대로 넣어준다.
                              (containerRefs.current[index] = element)
                            }
                            // draggable
                            draggable
                            onClick={() =>
                              eventHandler.focusContainerClick(sub)
                            }
                            onDoubleClick={() =>
                              eventHandler.editContainerDoubleClick(sub)
                            }
                            onDragStart={eventHandler.handleDragStart}
                            onDrag={eventHandler.handleDragOverText}
                            onDragEnter={eventHandler.handleDragEnterText}
                            onDragLeave={eventHandler.handleDragLeaveText}
                            onDrop={eventHandler.handleDragDrop}
                            onDragEnd={eventHandler.handleDragEnd}
                            className={`${
                              draggedText === sub
                                ? ""
                                : "transform transition-all ease-in-out "
                            } h-12 px-4 flex justify-center items-center relative cursor-pointer bg-gray-700 rounded-t-xl text-base text-yellow-300`}
                          >
                            {sub}
                          </h1>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isContainerSelected ? (
                  <form onSubmit={(e) => eventHandler.ContainerSubmit(e)}>
                    <input
                      onChange={(e) =>
                        eventHandler.createContainerTitleChange(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          dispatch({
                            type: "isContainerSelected",
                            payload: false,
                          });
                          dispatch({
                            type: "newContainerTitle",
                            payload: "",
                          });
                        }
                      }}
                      onBlur={() => {
                        dispatch({
                          type: "isContainerSelected",
                          payload: false,
                        });
                        dispatch({
                          type: "newContainerTitle",
                          payload: "",
                        });
                      }}
                      autoFocus={isContainerSelected && true}
                      value={newContainerTitle}
                      className="h-12 bg-transparent focus:outline-none"
                      placeholder="새 목차"
                    />
                    <span className="bg-purple-400">
                      {createContainerErrorMessage}
                    </span>
                  </form>
                ) : (
                  <button
                    onClick={(e) => eventHandler.createContainerClick(e)}
                    className="h-12 px-4 text-base text-gray-700 focus:outline-none"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                )}
              </div>
            </IndexSection>
          </div>

          <div className="flex flex-col px-10 py-10 min-h-screen bg-gray-500 bg-opacity-20">
            <MDEditor
              value={contentText}
              onChange={setContentText}
              preview={contentText ? "live" : "edit"}
              height={600}
              spellCheck="false"
            />
            <button
              onClick={(e) => eventHandler.editContentSubmit(e)}
              className="px-3 py-2 bg-black text-white"
            >
              완료
            </button>
          </div>
        </>
      ) : (
        <NotFound />
      )}
      {isModalOpen && (
        <div>
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed z-40 right-0 top-0  w-screen h-screen bg-black bg-opacity-60"
          ></div>
          <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 top-1/2 left-1/2 flex flex-col justify-between bg-white">
            <div></div>
            <button
              onClick={() => eventHandler.deleteSubjectClick()}
              className="text-center bg-red-500"
            >
              서브젝트 삭제
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubjectDetail;
