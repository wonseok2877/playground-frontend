import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

/* 로직
1. createHttpLink : 서버와 일치하는 uri로 HTTP 링크를 만든다.
2. setContext : localstorage에서 토큰을 가져와 인식한 뒤 headers를 담은
객체를 내뱉는다. */

// 함수 정의 : localstorage.getItem 값을 구해서 내뱉는 함수.
export const localToken = localStorage.getItem("admin-token");
// makeVar
export const authTokenVar = makeVar(localToken);
// 함수 정의 : 인자값을 넣고 locatstorage.setItem()
export const setToken = (token) => {
  localStorage.setItem("admin-token", token);
  authTokenVar(token);
};
// 함수 정의 : removeItem 실행하고 authTokenVar의 값을 null로 할당한다.
export const removeToken = () => {
  localStorage.removeItem("admin-token");
  authTokenVar("");
};

// ? : createHttpLink는 REST API때의 axios 인스턴스와 비슷한 건가.
const httpLink = createHttpLink({
  uri: "http://54.180.147.192:80/graphql",
});

// ? : setContext
const authLink = setContext(() => ({
  headers: {
    "x-jwt": authTokenVar(),
  },
}));

/* ApolloClient : The first thing we have to do when using Apollo is configure 
our ApolloClient instance. It needs to know the endpoint of our 
GraphQL API so it can deal with the network connections. */
export const client = new ApolloClient({
  // ? : concat()이 뭐야? 그럼 ApolloLink.from()은 뭔 역할이지.
  // ? : 그냥 {uri, headers} 아니야?ㅋㅋㅋㅋ 한번에 같이 보내면 안되나.
  // ? : link에서 저 headers를 보낸다는걸 어떻게 인식한다는거야?
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
