import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAdminCheck } from "../hooks/query";
import NotFound from "../components/etc/NotFound";
import DetailHeader from "../components/detail-header/DetailHeader";
import ContainerIndex from "../components/detail-index/ContainerIndex";
import ContentsSection from "../components/detail-contents/ContentsSection";
import SettingModal from "../components/detail-modal/SettingModal";
import { useQuery } from "@apollo/client";
import { GET_SUBJECT_QUERY } from "../graphql/query";
import NavBar from "../components/NavBar";
import SideBar from "../components/sidebar/SideBar";
import { stateContext } from "../context/stateContext";

// 함수 정의 : component
const SubjectDetail = () => {
  // useParams : id
  const { projectId, subjectId, containerId } = useParams();
  // useHistory
  const history = useHistory();
  // useState
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContainer, setCurrentContainer] = useState("");

  // useContext
  const { isSideBarOpen } = useContext(stateContext);
  // Hook : 토큰 유효성 검사 Query
  useAdminCheck();
  // useQuery
  const {
    loading: loadingSubject,
    data: subjectData,
    refetch: refetchSubject,
  } = useQuery(GET_SUBJECT_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        subjectId: Number(subjectId),
        containerTitle: containerId,
      },
    },
  });
  // useEffect : 마운팅 단계와 focusedContainer단계
  useEffect(() => {
    // if : 현재 선택된 container가 없을 경우 params의 string값으로 setState
    if (!currentContainer) {
      setCurrentContainer(containerId);
      // if : 집중하려는 컨테이너가 기존의 params과 달라지는 경우, 즉 선택한 경우 url replace()
    }
  }, [history, projectId, subjectId, containerId, currentContainer]);
  // useEffect : location이 바뀔 때마다 hitory의 action에 따라 data를 fetch할지 말지 결정한다.
  useEffect(() => {
    // html5 API history의 listen method
    history.listen(() => {
      // if : pop혹은 push가 아닌 replace, 즉 같은 페이지 내의 경우. 근데 이 방식은 너무 깨지기 쉽다. 다른 방식은 없을까.
      if (history.action === "REPLACE") {
        // refetch : 지금 data를 바로 렌더링하고 있기 때문에, refetch를 안 해주면 다른 container의 data를 가져온다.
        refetchSubject();
      }
    });
  }, [history, refetchSubject]);
  // useEffect : subject Query로 온 data
  useEffect(() => {
    console.log(subjectData);
    if (subjectData) {
      if (subjectData.subject.error) {
        console.log(subjectData.subject.error);
      }
    }
  }, [subjectData]);

  return (
    <div className="overflow-hidden bg-gray-100">
      <NavBar />
      <SideBar />
      <div
        className={` flex flex-col w-screen h-screen pt-14 bg-gray-100  ${
          isSideBarOpen ? "transform pl-64" : ""
        } transition-all ease-in-out duration-500`}
      >
        {subjectData?.subject.ok ? (
          <>
            <ContentsSection
              subjectData={subjectData}
              refetchSubject={refetchSubject}
              currentContainer={currentContainer}
              setCurrentContainer={setCurrentContainer}
            />
            {isModalOpen && <SettingModal setIsModalOpen={setIsModalOpen} />}
          </>
        ) : (
          <NotFound />
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
