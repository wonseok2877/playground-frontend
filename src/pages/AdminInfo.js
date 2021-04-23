import NavBar from "../components/NavBar";
import { useAdminCheck } from "../hooks/query";
const AdminInfo = () => {
  // useLazyQuery
  const { loading, error, data } = useAdminCheck();

  return (
    <>
      <NavBar />
      {loading
        ? null
        : error
        ? null
        : data && (
            <div>
              <h1>id : {data.me.id}</h1>
              <h1>이름 : {data.me.name}</h1>
              <h1>role : {data.me.role}</h1>
              <h1>생성일 : {data.me.createdAt}</h1>
              <h1>업데이트 일: {data.me.updatedAt}</h1>
              <h1>타입 이름 : {data.me.__typename}</h1>
              <h1>권한 : {data.me.verified ? "있음" : "없음"}</h1>
            </div>
          )}
    </>
  );
};

export default AdminInfo;
