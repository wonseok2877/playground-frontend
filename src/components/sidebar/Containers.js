import { useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import {
  CONTAINERS_INDEX_MUTATION,
  EDIT_CONTAINER_MUTATION,
} from "../../graphql/mutation";

// 함수 정의 : component
const Containers = ({ projectId, subject, containerId }) => {
  // useHistory
  const history = useHistory();
  //   useState
  const [whichTitleModified, setWhichTitleModified] = useState("");
  const [containerTitleText, setContainerTitleText] = useState("");
  const [virtualIndex, setVirtualIndex] = useState([]);
  const [draggedText, setDraggedText] = useState("");
  // useRef
  const containerRefs = useRef([]);
  //   useMutation
  const [editContainerTitle] = useMutation(EDIT_CONTAINER_MUTATION, {
    variables: {
      input: {
        title: whichTitleModified,
        subjectId: Number(subject.id),
        newTitle: containerTitleText,
      },
    },
  });
  const [changeContainersIndex] = useMutation(CONTAINERS_INDEX_MUTATION);

  // useEffect
  useEffect(() => {
    // setState
    setVirtualIndex(subject.containers_index.split(","));
  }, [subject]);

  //  변수 정의
  let clickCount = 0;
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
            subjectId: Number(subject.id),
            // state가 아닌, 직접 인자값으로 받은 새로운 array값을 넣는다.
            containersIndex: newArray,
          },
        },
      });
      if (error) throw new Error(error);
      if (ok) {
        // ? : refetch 필요한가 필요하지 않은가
        setVirtualIndex(newArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 객체 정의
  const eventHandler = {
    // onClick
    containerClick: (containerTitle) => {
      clickCount++;
      //   setTimeout
      window.setTimeout(() => {
        //  조건문 : click count에 따라서.
        if (clickCount > 1) {
          console.log("double clicked.");
          // setState
          setWhichTitleModified(containerTitle);
          setContainerTitleText(containerTitle);
          clickCount = 0;
        } else if (clickCount === 1) {
          console.log("single clicked.");
          // push method
          history.push(
            `/project/${projectId}/subject/${subject.id}/${containerTitle}`
          );
          clickCount = 0;
        }
      }, 250);
    },
    // onChange
    containerTitleChange: ({ target: { value } }) => {
      setContainerTitleText(value);
    },
    // onSubmit
    containerTitleSubmit: async (event) => {
      event.preventDefault();
      // try & catch block
      try {
        // mutation 함수 실행
        const { data } = await editContainerTitle();
        console.log(data);
        // refetch : container
      } catch (error) {
        console.log(error);
      } finally {
        // setState : initiallize
        setWhichTitleModified("");
      }
    },
    // onBlur
    containerTitleBlur: () => {
      setWhichTitleModified("");
    },
    // onDrag
    handleDragStart: ({ target: { innerText } }) => {
      // ? : 왜 되지. 페이지안의 다른 것들도 drag해봤는데 딱 innerText만 인식하네.
      setDraggedText(innerText);
      // web API : asynchronous를 이용한다.
    },
    handleDragEnd: () => {
      // state initialize
      setDraggedText("");
    },
    handleDragDrop: ({ target }) => {
      console.dir(target);
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
        console.log(newArray);
        // splice() : 원래 자리의 string값을  제거한다.
        // indexOf() : 해당 string값의 순서값을 return하는 함수 호출.
        newArray.splice(newArray.indexOf(draggedText), 1);
        // splice() : drag된 string값을 해당 박스의 순서에 밀어 넣는다.
        newArray.splice(boxId, 0, draggedText);
        console.log(newArray);
        containersIndexSubmit(newArray);
      }
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
      }
    },
    handleDragOverBox: (event) => {
      // preventDefault() : onDragOver의 디폴트 효과를 막음.
      event.preventDefault();
    },
  };

  return (
    <>
      {virtualIndex.map((containerItem, index) => (
        <div key={index} className="flex flex-col cursor-default">
          {whichTitleModified === containerItem ? (
            <form onSubmit={eventHandler.containerTitleSubmit} className="flex">
              <i className="fas fa-sticky-note text-base mr-2"></i>
              <input
                value={containerTitleText}
                onChange={eventHandler.containerTitleChange}
                onBlur={eventHandler.containerTitleBlur}
                style={{
                  backgroundColor: "#405b61",
                  outline: "none",
                }}
                autoFocus
                spellCheck={false}
              />
            </form>
          ) : (
            <div
              id={index}
              onClick={() => eventHandler.containerClick(containerItem)}
              onDragOver={eventHandler.handleDragOverBox}
              onDrop={eventHandler.handleDragDrop}
            >
              <i className="fas fa-sticky-note text-base mr-2"></i>
              <span
                ref={(element) =>
                  // []표현으로 array안에다가 순서대로 넣어준다.
                  (containerRefs.current[index] = element)
                }
                // draggable
                draggable
                onDragStart={eventHandler.handleDragStart}
                onDragEnter={eventHandler.handleDragEnterText}
                onDrop={eventHandler.handleDragDrop}
                onDragEnd={eventHandler.handleDragEnd}
                className={` ${
                  containerId === containerItem
                    ? "text-yellow-300"
                    : "text-white"
                }`}
              >
                {containerItem}
              </span>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Containers;
