import AllTitleForm from "./AllTitleForm";
import DetailHeaderWrapper from "./DetailHeaderWrapper";
import SettingButton from "./SettingButton";

const DetailHeader = ({ subjectData, refetchSubject, setIsModalOpen }) => {
  return (
    <>
      <DetailHeaderWrapper>
        <AllTitleForm
          subjectData={subjectData}
          refetchSubject={refetchSubject}
        />
        <SettingButton setIsModalOpen={setIsModalOpen} />
      </DetailHeaderWrapper>
    </>
  );
};

export default DetailHeader;
