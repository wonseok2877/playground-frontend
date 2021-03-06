import { useMutation } from "@apollo/client";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  DELETE_CONTAINER_MUTATION,
  EDIT_CONTAINER_MUTATION,
} from "../../graphql/mutation";

// 함수 정의 : Component
const ContentsSection = ({
  subjectData,
  refetchSubject,
  setCurrentContainer,
}) => {
  // useParams
  const { subjectId, containerId } = useParams();
  // useState
  // boolean
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContentChanged, setIsContentChanged] = useState(false);
  const [isControlKeyPressed, setIsControlKeyPressed] = useState(false);
  const [isSKeyPressed, setIsSKeyPressed] = useState(false);
  // string
  const [contentText, setContentText] = useState("");
  const [updatedDate, setUpdatedDate] = useState(null);
  // useRef
  const modalRef = useRef(null);
  // useMutation
  const [editContainerContent] = useMutation(EDIT_CONTAINER_MUTATION, {
    variables: {
      input: {
        subjectId: Number(subjectId),
        title: containerId,
        content: contentText,
      },
    },
  });
  const [deleteContainer] = useMutation(DELETE_CONTAINER_MUTATION, {
    variables: {
      input: {
        subjectId: Number(subjectId),
        containerTitle: containerId,
      },
    },
  });
  // 변수 정의 : project Query문의 핵심 data
  const { result } = subjectData.subject;
  const containersIndex = result.containers_index.split(",");

  // useEffect : mounting
  useEffect(() => {
    // 함수 정의 : keydown과 keyup event handler
    const keydownHandler = (event) => {
      // 조건문 : s키와 ctrl키가 동시에 눌린 경우.
      if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        // 함수 정의 : async
        const postData = async () => {
          try {
            const { data } = await editContainerContent();
            console.log(data);
            await refetchSubject();
          } catch (error) {
            console.log(error);
          }
        };
        postData();
      }
    };

    // addEventListener
    window.addEventListener("keydown", keydownHandler);
    // clean up
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);
  // useEffect : key pressed state

  // useEffect : Query문 요청에 대한 result.
  useEffect(() => {
    // if : subjectData가 있을 경우에만 실행
    if (result) {
      // if : textarea의 value가 null이 들어가면 안되도록.
      if (result.containers[0].content) {
        setContentText(result.containers[0].content);
      } else {
        setContentText("");
      }
      // 서버쪽에서 container을 생성하면 자동으로 updatedAt을 만들어줌.
      // AWS쪽 혹은 서버쪽에서 UTC시간으로 변환하고 있다. 한국시간으로 바꿔줘야 함.
      const utcTime = new Date(result.containers[0].updatedAt);
      const koreanTime =
        utcTime.getTime() - utcTime.getTimezoneOffset() * 60000;
      const localeTime = new Date(koreanTime).toLocaleString();
      setUpdatedDate(localeTime);
    } else {
      return;
    }
  }, [result]);
  // useEffect : contentText state
  useEffect(() => {
    const { content } = result.containers[0];
    // if : 기본 state가 다 있고, data로 온 content와 state가 다를 경우에만.
    if (contentText && contentText !== content) {
      // setState
      setIsContentChanged(true);
    } else {
      setIsContentChanged(false);
    }
  }, [contentText, result]);
  // useEffect : ref
  useEffect(() => {
    // 함수 정의 : event listener
    const handleMouseDown = (event) => {
      // contains method !
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsDeleteModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [modalRef]);

  // 변수 정의 : 객체
  const eventHandler = {
    editContentSubmit: async (event) => {
      event.preventDefault();
      try {
        const { data } = await editContainerContent();
        console.log(data);
        // refetch
        refetchSubject();
      } catch (error) {
        console.log(error);
      }
    },
    cancelContainerEdit: () => {
      setContentText(result.containers[0].content);
    },
    trashIconClick: () => setIsDeleteModalOpen(true),
    deleteContainerClick: async () => {
      try {
        const { data } = await deleteContainer();
        console.log(data);
        if (data.deleteContainer.ok) {
          // setState
          setCurrentContainer(containersIndex[0]);
        }
      } catch (error) {
        console.log(error);
      }
    },
  };
  return (
    <>
      <div className="px-5 pt-10 pb-32">
        <div className="h-5 flex justify-between items-center mb-2">
          <i
            className={`fas fa-circle ${
              isContentChanged ? "text-yellow-400" : "text-green-500"
            } transition-colors ease-in-out duration-300`}
          ></i>
          <h1>마지막 수정 : {updatedDate}</h1>
          <div className="relative">
            {isDeleteModalOpen ? (
              <div
                ref={modalRef}
                className={`absolute z-10 w-48 h-16 right-0 flex flex-col justify-between p-1 bg-white border-2 border-black rounded-lg`}
              >
                <h1>Are you sure to delete?</h1>
                <div>
                  <button
                    onClick={eventHandler.deleteContainerClick}
                    className="px-2 rounded-sm bg-red-600 focus:outline-none"
                  >
                    Yes
                  </button>
                  <button
                    className="px-2 rounded-sm bg-yellow-300 focus:outline-none"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <i
                className="fas fa-trash-alt z-0"
                onClick={eventHandler.trashIconClick}
              ></i>
            )}
          </div>
        </div>
        <MDEditor
          value={contentText}
          onChange={setContentText}
          preview={contentText ? "live" : "edit"}
          height={window.innerHeight - 200}
          minHeight={300}
          maxHeight={800}
          spellCheck="false"
        />
      </div>
      <div
        className={`${
          isContentChanged ? "" : "hidden"
        } fixed z-10 bottom-0 w-screen px-10 py-5 flex justify-between items-center bg-white`}
      >
        <div></div>
        <div>
          <button
            onClick={eventHandler.cancelContainerEdit}
            className="px-3 py-2 text-gray-600 focus:outline-none"
          >
            취소
          </button>
          <button
            onClick={eventHandler.editContentSubmit}
            className="px-3 py-2 bg-black text-white focus:outline-none"
          >
            완료
          </button>
        </div>
      </div>
    </>
  );
};

export default ContentsSection;
