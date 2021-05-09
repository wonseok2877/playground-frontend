import { useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  CONTAINERS_INDEX_MUTATION,
  CREATE_CONTAINER_MUTATION,
  DELETE_CONTAINER_MUTATION,
  EDIT_CONTAINER_MUTATION,
} from "../../graphql/mutation";

const ContainerIndex = ({
  subjectData,
  refetchSubject,
  currentContainer,
  setCurrentContainer,
}) => {
  const history = useHistory();
  // useParams
  const { projectId, subjectId, containerId } = useParams();
  console.log(projectId, subjectId, containerId);
  // useState
  const [virtualIndex, setVirtualIndex] = useState([]);
  const [draggedText, setDraggedText] = useState("");
  const [focusedContainerToEdit, setFocusedContainerToEdit] = useState("");
  const [newContainerText, setNewContainerText] = useState("");
  const [edittedContainerText, setEdittedContainerText] = useState("");
  const [isCreateFormFocused, setIsCreateFormFocused] = useState(false);
  const [
    errorMessageOnCreateContainer,
    setErrorMessageOnCreateContainer,
  ] = useState("");
  // 변수 정의 : project Query문의 핵심 data
  const { result } = subjectData?.subject;
  const containersIndex = result.containers_index.split(",");
  // useRef
  const containerRefs = useRef([]);

  // useMutation
  const [changeContainersIndex] = useMutation(CONTAINERS_INDEX_MUTATION);
  const [editContainerTitle] = useMutation(EDIT_CONTAINER_MUTATION, {
    variables: {
      input: {
        title: focusedContainerToEdit,
        subjectId: +subjectId,
        newTitle: edittedContainerText,
      },
    },
  });
  const [createContainer] = useMutation(CREATE_CONTAINER_MUTATION, {
    variables: {
      input: {
        subjectId: +subjectId,
        title: newContainerText,
      },
    },
  });
  const [deleteContainer] = useMutation(DELETE_CONTAINER_MUTATION, {
    variables: {
      input: {
        subjectId: +subjectId,
        containerTitle: containerId,
      },
    },
  });

  // 변수 정의 : 클릭 횟수. 여기서 정의할 필요가 있나
  //   ? : 지금 이 변수는 setState를 안 해서 다행인거다. 원래라면 리렌더링할 때마다 초기화되어야 함.
  let clickCount = 0;

  // useEffect
  useEffect(() => {
    setVirtualIndex(result.containers_index.split(","));
  }, [result]);

  //  함수 정의 : 야바위 로직과 Mutation문 함수 호출
  const containersIndexSubmit = async (newArray) => {
    if (typeof newArray !== "object") return;

    // 변수 선언 : newArray 애기들 비교. map 안에서 각각의 애기들을 비교하면 된다.
    // map()과 find() : 하나라도 다른게 있을 경우 false가 array로 들어간다.
    const isDifferent = newArray.map((newGuy) => {
      const eachGuy = virtualIndex.find((oldGuy) => oldGuy === newGuy);
      if (eachGuy) return false;
      else return true;
    });
    const checkIsRepeated = () => {
      let saveCount = 0;
      newArray.map((guy) => newArray.map((gay) => gay === guy && saveCount++));
      return saveCount;
    };
    const repeatCount = checkIsRepeated();
    // if : 둘이 값이 아예 같으면 함수 실행 안함.
    // ? : 왜 array일때는 값이 다른거지? type도 같고 안의 값들도 같은 array인데. 다른 주솟값이기 때문.
    if (virtualIndex.toString() === newArray.toString()) {
      console.log("요청할 필요가 없음.");
      return;
      // if : 두 array의 길이가 같지 않을때. 즉 어느 한쪽이 부족하거나 더 많을 땐 initialize하고 return.
    } else if (newArray.length !== virtualIndex.length) {
      console.log("갯수가 안 맞음");
      return;
      // if : array안에 하나라도 true가 있을 경우. 즉 string값이 다를 경우.
    } else if (isDifferent.find((c) => c)) {
      console.log("원래 없던 값");
      return;
      // if : 중복. 서로 같은 숫자가 newArray 길이보다 길 경우
    } else if (repeatCount > newArray.length) {
      console.log("중복!");
      return;
    }
    console.log("정상 요청~");
    // try & catch
    try {
      const {
        data: {
          changeContainersIndex: { error, ok },
        },
      } = await changeContainersIndex({
        variables: {
          input: {
            subjectId: +subjectId,
            // state가 아닌, 직접 인자값으로 받은 새로운 array값을 넣는다.
            containersIndex: newArray,
          },
        },
      });
      console.log(ok);
      if (error) throw new Error(error);
      if (ok) {
        // ? : refetch 필요한가 필요하지 않은가
        setVirtualIndex(newArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeStyleChange = (boxId) => {
    if (!containerRefs) return;
    // error : containerRefs.current[boxId] is null.
    containerRefs.current[boxId].style.backgroundColor = "#404045";
  };

  const eventHandler = {
    //   onClick
    editContainerDoubleClick: (name) => {
      setFocusedContainerToEdit(name);
      setEdittedContainerText(name);
    },
    createContainerClick: () => {
      setIsCreateFormFocused(true);
    },
    focusContainerClick: (name) => {
      clickCount++;
      setTimeout(() => {
        // ! : 1초라는 timeout동안 clickCount가 변하는구나. 그래서 함수에서 clickCount를 올렸어도, setTimeOut안에서는 clickCount가 바뀐대로 바로 적용되는 것. call back!
        if (clickCount <= 0) {
          return;
        } else if (clickCount > 1) {
          console.log("double clicked.");
          clickCount = 0;
          // else : 한 번 눌렀다고 간주하는 경우
        } else {
          // setState
          history.push(`/project/${projectId}/subject/${subjectId}/${name}`);
          clickCount = 0;
          return;
        }
      }, 150);
    },
    deleteContainerClick: async () => {
      try {
        const { data } = await deleteContainer();
        console.log(data);
        if (data?.deleteContainer.ok) {
          await refetchSubject();
        } else {
          throw new Error(data.deleteContainer.error);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    // onChange
    editContainerTitleChange: (event) => {
      setEdittedContainerText(event.target.value);
    },
    createContainerTitleChange: (event) => {
      setNewContainerText(event.target.value);
    },
    // 함수 정의 : drag event
    handleDragStart: ({ target }) => {
      console.dir(target.style);
      // ? : 왜 되지. 페이지안의 다른 것들도 drag해봤는데 딱 innerText만 인식하네.
      setDraggedText(target.innerText);
      // web API : asynchronous를 이용한다.
    },
    handleDragEnd: (event) => {
      const boxId = event.target.parentElement.id;
      removeStyleChange(boxId);
      // state initialize
      setDraggedText("");
    },
    handleDragOverBox: (event) => {
      // preventDefault() : onDragOver의 디폴트 효과를 막음.
      event.preventDefault();
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

        removeStyleChange(boxId);
      }
    },
    handleDragEnterBox: (event) => {
      if (!event.target.id) return;
      const boxId = event.target.id;
      containerRefs.current[boxId].style.backgroundColor = "#6b6b75";
    },
    handleDragLeaveBox: (event) => {
      if (!event.target.id) return;
      const boxId = event.target.id;
      setTimeout(() => removeStyleChange(boxId), 1000);
    },
    handleDragEnterText: (event) => {
      console.log(event);
      console.log(event.target.innerText);
      console.log(draggedText);
      let boxId;
      // relatedTarget이냐 parentElement이냐.
      if (event.relatedTarget?.id) boxId = event.relatedTarget?.id;
      else if (event.target.parentElement.id)
        boxId = event.target.parentElement.id;
      else return;
      console.log(boxId);
      // 해당 박스가 아닐 경우에만
      if (event.target.innerText !== draggedText) {
        // ! : setTimeOut으로 div의 onDragLeave의 callstack 뒤에 놓는다.
        setTimeout(() => {
          containerRefs.current[boxId].style.backgroundColor = "#6b6b75";
        }, 0);
      }
    },
    handleDragLeaveText: (event) => {
      console.log(event);
      const boxId = Number(event.target.parentElement.id);
      // removeStyleChange(boxId);
      // setTimeOut()
      setTimeout(() => removeStyleChange(boxId), 10);
    },
    // onSubmit
    editContainerSubmit: async (event) => {
      event.preventDefault();
      const isSame = containersIndex.find((t) => t === edittedContainerText);
      // if : 기존 data에서 지금 입력하려는 state와 같은게 있을 경우 취소시킴.
      if (isSame !== undefined) {
        setFocusedContainerToEdit("");
        return;
      }
      // try & catch
      try {
        const { data } = await editContainerTitle();
        console.log(data);
        // if : 서버쪽에서 ok가 나지 않으면 에러를 던진다.
        if (!data.editContainer.ok) {
          throw new Error(data.editContainer.error);
        }
        // refetch
        await refetchSubject();
        // setState : initiallizing
        setFocusedContainerToEdit("");
        // if : 현재 페이지의 subject 이름을 바꾸려고 하는 경우
        if (currentContainer === focusedContainerToEdit) {
          setCurrentContainer(edittedContainerText);
        }
      } catch (error) {
        console.error(error);
        return;
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
          // refetch
          await refetchSubject();
          // setState
          setCurrentContainer(newContainerText);
          setNewContainerText("");
          setIsCreateFormFocused(false);
        }
      } catch (error) {
        setErrorMessageOnCreateContainer(error.message);
      }
    },
    // onKeydown
    editContainerKeyDown: (event) => {
      if (event.key === "Escape") {
        setFocusedContainerToEdit("");
      }
    },
    createContainerKeyDown: (event) => {
      if (event.key === "Escape") {
        setIsCreateFormFocused(false);
        setNewContainerText("");
      }
    },
    // onBlur
    editContainerBlur: () => {
      setFocusedContainerToEdit("");
    },
    createContainerBlur: () => {
      setIsCreateFormFocused(false);
      setNewContainerText("");
    },
  };
  return (
    <div className="h-16 ml-4 flex items-end">
      <div className="flex">
        {virtualIndex?.map((containerItem, index) => (
          <div key={index}>
            <div
              // id props에 순서 할당.
              id={index}
              onDragOver={eventHandler.handleDragOverBox}
              onDrop={eventHandler.handleDragDrop}
              onDragEnter={eventHandler.handleDragEnterBox}
              onDragLeave={eventHandler.handleDragLeaveBox}
              className=" flex justify-center items-center "
            >
              {focusedContainerToEdit === containerItem ? (
                <form onSubmit={eventHandler.editContainerSubmit}>
                  <input
                    value={edittedContainerText}
                    onKeyDown={eventHandler.editContainerKeyDown}
                    onBlur={eventHandler.editContainerBlur}
                    autoFocus={focusedContainerToEdit === containerItem && true}
                    onChange={eventHandler.editContainerTitleChange}
                    className="h-12 px-5 flex justify-center items-center relative cursor-pointer text-base text-yellow-300 bg-transparent focus:outline-none"
                    style={{ backgroundColor: "#404045", maxWidth: "10rem" }}
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
                    eventHandler.focusContainerClick(containerItem)
                  }
                  onDoubleClick={() =>
                    eventHandler.editContainerDoubleClick(containerItem)
                  }
                  onDragStart={eventHandler.handleDragStart}
                  onDragEnter={eventHandler.handleDragEnterText}
                  onDragLeave={eventHandler.handleDragLeaveText}
                  onDrop={eventHandler.handleDragDrop}
                  onDragEnd={eventHandler.handleDragEnd}
                  className={`${
                    draggedText === containerItem
                      ? ""
                      : "transform transition-all ease-in-out "
                  } ${
                    currentContainer === containerItem &&
                    "border-b-4 border-yellow-300"
                  } h-12 px-5 flex justify-center items-center relative cursor-pointer text-base text-yellow-300`}
                  style={{ backgroundColor: "#404045", minWidth: "4rem" }}
                >
                  {containerItem}
                </h1>
              )}
            </div>
          </div>
        ))}
      </div>
      {isCreateFormFocused ? (
        <form onSubmit={eventHandler.ContainerSubmit}>
          <input
            onChange={eventHandler.createContainerTitleChange}
            onKeyDown={eventHandler.createContainerKeyDown}
            onBlur={eventHandler.createContainerBlur}
            autoFocus={isCreateFormFocused && true}
            value={newContainerText}
            className="h-12 pl-3 text-gray-300 focus:outline-none"
            style={{ backgroundColor: "#404045", minWidth: "4rem" }}
            placeholder="새 목차"
          />
          <span className="bg-purple-400">{errorMessageOnCreateContainer}</span>
        </form>
      ) : (
        <button
          onClick={eventHandler.createContainerClick}
          className="h-12 px-4 text-base text-gray-700 focus:outline-none"
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  );
};

export default ContainerIndex;
