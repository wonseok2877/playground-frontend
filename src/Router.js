import { useReactiveVar } from "@apollo/client";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { authTokenVar } from "./apolloClient";
import AdminInfo from "./pages/AdminInfo";
import Login from "./pages/Login";
import Main from "./pages/Main";
import SubjectDetail from "./pages/SubjectDetail";
import Register from "./pages/Register";
import CreateSubject from "./pages/CreateSubject";
import Project from "./pages/Project";
import CreateProject from "./pages/CreateProject";
import Header from "./components/Header";
// 토큰이 없을 경우에 로그인 페이지, 있으면 메인페이지
// 메인페이지에선 me Query문을 보내서 ok가 false면 토큰 삭제
/* 로직
1.
2. Redirect : 여기서 정의한 것 외의 path는 모두 메인 페이지로.
3. conditianal : Redirect로 토큰의 유무에 따라 path를 통제한다. */
// ? : 왜 Redirect에 exact가 필요한거지?
// ? : 왜 {"login" || "register"} 식으로 하면 뒤의 것은 다 무시되지? 이건 표현방식의 문제.
// 함수 선언 : Router
const Router = () => {
  // 변수 선언 : apollo의 useReactiveVar
  // ! : useReactiveVar은 Context의 state와 같구나. 얘의 값이 바뀔 때마다 연관된 함수와 component들이 다 실행된다.
  // ! : 어떤 놈이 React안의 authToken 변수를 찾아서 넣지 않는 한, 이 보호막이 뚫릴 일은 없다. 로컬스토리지에 대해선 당연히 막아지고.
  const authToken = useReactiveVar(authTokenVar);

  // 프론트쪽에서 토큰 유효기간 판단하기 !
  // jwt-decode : 서버쪽에서 온 token을 해석한다.
  // ? : 서버쪽에서 expired를 안 만든 듯 보인다.
  const currentTime = Date.now() / 1000;
  try {
    const decodedToken = jwtDecode(authToken);
    if (decodedToken.iat + 3600 < currentTime) console.log("한시간 지났음 !");
    else console.log("아직 한 시간 안 지났음");
  } catch (error) {
    console.log(error.message);
  }
  /* ! : ApolloClient파일에서 할당한 후에 값을 가져오면 Router에서 그 고정된 값을 가져올 수밖에 없다.
  Router는 페이지가 바뀔 때마다 실행되므로, 여기서 getItem()을 실행하면
  따끈따끈한 토큰을 가져올 수 있다. 방금 로그인 페이지에서 setItem을 했어도. */

  // if & else : global 변수의 boolean값에 따라서 다른 콘솔을 찍어준다.
  if (authToken) console.log("logged in.");
  else console.log("you have to log in.");

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        {!authToken && (
          <>
            <Redirect exact from="/" to="/login" />
            <Redirect exact from="/admin/*" to="/login" />
            <Redirect exact from="/project/*" to="/login" />
          </>
        )}
        <Route exact path="/" component={Main} />
        <Route exact path="/admin/info" component={AdminInfo} />
        <Route exact path="/project/create" component={CreateProject} />
        <Route exact path="/project/:projectId" component={Project} />
        <Route
          exact
          path="/project/:projectId/subject/create"
          component={CreateSubject}
        />
        <Route
          exact
          path="/project/:projectId/subject/:subjectId/:containerTitle"
          component={SubjectDetail}
        />
        <Redirect from="/*" to="/" />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
