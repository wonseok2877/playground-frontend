import { useQuery } from "@apollo/client";
import { removeToken } from "../../apolloClient";
import { GET_ADMIN_QUERY } from "../../graphql/query";

/* 로직 설명 필요.
지금 apollo client파일에서 설정한 headers가 전제 되어있다는걸 잊어선 안됨. */

const useAdminCheck = () => {
  const { loading, error, data } = useQuery(GET_ADMIN_QUERY);

  // conditioanl : 로딩이 끝났고, 유효하지 않은 토큰이라는 에러가 뜨는 경우
  if (!loading && error) {
    console.log(error);
    // 토큰을 아예 없앤다. 로그아웃 로직과 동일함.
    removeToken();
  }
  return { loading, error, data };
};

export default useAdminCheck;
