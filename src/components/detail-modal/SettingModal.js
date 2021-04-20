import { useMutation } from "@apollo/client";
import { useHistory, useParams } from "react-router";
import { DELETE_SUBJECT_MUTATION } from "../../graphql/mutation";

const SettingModal = ({ setIsModalOpen }) => {
  // router hooks
  const { subjectId } = useParams();
  const history = useHistory();
  // useMutation
  const [deleteSubject] = useMutation(DELETE_SUBJECT_MUTATION, {
    variables: {
      input: {
        subjectId: +subjectId,
      },
    },
  });
  const eventHandler = {
    //   함수 정의 : onCLick event 함수
    exitModalClick: () => setIsModalOpen(false),
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
  };
  return (
    <>
      <div>
        <div
          onClick={eventHandler.exitModalClick}
          className="fixed z-40 right-0 top-0  w-screen h-screen bg-black bg-opacity-60"
        ></div>
        <div className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 top-1/2 left-1/2 flex flex-col justify-between bg-white">
          <div></div>
          <button
            onClick={eventHandler.deleteSubjectClick}
            className="text-center bg-red-500"
          >
            서브젝트 삭제
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingModal;
