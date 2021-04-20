import AllTitleForm from "./AllTitleForm";
import DetailHeaderWrapper from "./DetailHeaderWrapper";
import SettingButton from "./SettingButton";

const DetailHeader = ({ subjectData, refetchSubject, setIsModalOpen }) => {
  console.log("DetailHeader rendered.");

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
