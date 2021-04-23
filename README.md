# JS 궁금증
- 변수 다루는 법 : 어떨 떄 let을 쓰고 어떨 때 const를 써야 하는지. state에 너무 익숙해져있음. 변수를 잘 다루고, 변수와 state의 공통점과 차이점을 안 이후에야 state를 잘 쓸 수 있다.
- scope
- immutable object 개념과 spread operator : React에서 이 개념들이 자주 쓰인다고 들었다. state때문인 듯한데, 왜 state는 바로 건들면 안 되는거야?
- call stack 개념 : setTimeOut과 setInterval. `setTimeOut(()=>function(), 0)`의 의미. 해당 함수에서 바로 끝내는 것이 아니라 queue로 넘긴다는 의미라고 생각된다 지금은.
- 반복문 : 그냥 미숙함.
- array method들 : splice(), find() 등등
- data를 어떤 방식으로 다뤄야 하는지 감이 많이 안 잡힘. 
- window object : onDragStart와 같은 eventListener들도 그렇고 clientX같은 요소들도 그렇고 아직 모르는게 많다.
- 에러 핸들링 : try & catch & finally


# React 궁금증
- state 값이 바뀔 때 한 scope 안에서는 바로 그 변화를 인식할 수 없다. state에 대해서 더 알아야 할 듯. 이건 기본적인 함수와 변수의 지식인가? 실행 컨텍스트 개념과도 연결되는 듯 하다.
- useEffect의 dependency : 어떨 때 필요하고 어떨 때 필요 없는가? 마운팅 단계 혹은 특정 state를 대상으로 할 경우에만 dependency가 필요한가? 여러개가 있다면 그중의 하나만 바뀌어도 trigger가 되는건가 아니면 다 한 번씩 바뀌는걸 얘가 기억하고 있다가 다 모이면 그 때 실행되는건가?
- Router 다루는 법. Switch와 Redirect. 그리고 보통의 component에서도 Route를 쓸 수 있나? Router을 그냥 component로 생각하면 될 듯.
- useRef : useRef는 어떨 때 써야 하는가? onClick처럼 element가 props로 addEventListener의 기능을 쓸 수 있는 경우엔 useRef가 필요 없다. 또한 useRef를 array혹은 object type으로 저장할 수 있나?
- html의 기본 props와 React JSX의 props의 차이점.
- React의 Hook들 : useReducer, useRef, useMemo, useCallback
- React Form과 Controlled Components
- data fetching을 최소화하는 state구조.
- design pattern
- 리렌더링을 최소화
- 메모리 차지를 최소화


# Apollo client 궁금증
- useQuery : 마운팅 단계에서 기본적으로 실행되는건가? useEffect가 필요없어 보인다. 따로 함수를 실행하지 않아도 loading과 data를 인식할 수 있고, 각각의 값이 달라질 때마다 리렌더링된다.
- useQuery와 useLazyQuery의 차이점.
- cache개념 : apollo client는 얘를 어떤 메커니즘으로 만드는가. 어떻게 쓰는가.
- refetch() : 아무리 봐도 개사기다. 일단은 감사하게 쓰는데..그냥 넘어가기 찝찝. useQuery에서만 쓰는건가? 어떻게 쓰는건가. 
- ApolloClient의 setContext
- token : 어떻게 저장하고 어떻게 request headers에 보내야 할까? localstorage가 최선인가? 유효한 토큰인지는 어떻게 검사하나?
- jwt-decode
- update(), onError() : useMutation의 전반적인 이해도가 필요하다.
- graphQLErrors
- makeVar()과 useReactiveVar() 그리고 Context state
- refetch network-onlyㅋㅋㅋ

# 구상

## 아예 야무진 소통 툴로?
md파일만이 아니라 

## 쓸 때의 관점으로
우선 지금은 2번이다. 별로라고 생각한다. 직관적이지 못하고, 나열할 때의 편한 구석이 없다. 아니면 프로젝트의 개념을 작게 해도 괜찮을 듯 하다. 프로젝트 안에 서브젝트가 여러개 보기 편하게 되어있고, 컨테이너는 그냥 서브젝트마다의 컨텐츠를 담고 있는 순서일 뿐. 
어차피 서브젝트를 2~3개 정도만 만들거라면, 그냥 프로젝트를 2~3개 나눠서 만들면 그만 아닌가. 
1. 슬랙처럼, 순서대로 댓글 쓰듯이 나열하기. 유저끼리의 피드백을 직관적으로 보기에 좋다.
2. 목차마다 딱딱 나눠서 하나의 큰 콘텐츠. 지금의 경우 markdown의 비중이 커짐. 여기 안에서 우리 나름의 순서를 정하고 등등. 나무위키같은 느낌이 된다.
3. 목차 안에서 순서대로. 컨텐츠 자체가 array가 되서 subject가 거대해짐. 아직은 필요 없을 듯.


# 고칠 점들

## favicon과 title
React-helmet이 생각난다. 

## 메인 페이지의 기능이 너무 부족. 스레드 개념은 어떨까?
현재의 메인페이지는 각각의 project와 종속 subject들을 나열하는게 끝이다. 각각 project의 환경 설정, 프로젝트 진행 상황, 해당 유저에 대한 최근의 피드백 등등의 기능이 있으면 정말 좋겠다. 나중에는 유저들끼리의 채팅까지.

## project configuration
지금은 edit project mutation의 title, goal바꾸기 기능이 끝이다. 그러나 다른 기능이 늘어남에 따라 이 configuration component는 커질 것이다.
서버 문제 : project의 목표만 바꿀 수가 없음. 

## SideBar의 필요성
얘네는 태스크를 분류하는데 핵심이지만, 하나의 페이지를 구성할 정도는 아니라고 생각한다. 따라서 나는 SideBar로 이걸 옮기고 싶다.
어설픈 깃허브 클론이라고 볼 수도 있겠지만, 일단 직접 써보는 것에 의의가 있으니깐.
스타일은 file directory 형태가 어떨까?

## 수정 정보
각각의 contents 상단에, 그것이 언제, 누구에 의해서, 무엇이 업데이트 되었는지 알려주고 싶다. 그리고 commit history처럼 그 기록을 보여주고 싶다.

## 상단 Navbar
- 유저 설정 메뉴바
- style
- 로고

# 문제들

## container contents의 data fetch문제
처음 받아올 땐 잘 받아온다. 그러나 두번째부터 cache에 의존하기 시작하면서 data를 이전 container의 data만을 가져온다.

서버로부터의 result 자체가 안 바뀐다. 
? : Apollo Client는 cache를 저장할 때 Query단위로 저장하는 것 같다. 그래서 단 하나의 Query로 그 안의 property들까지 여러번 cache화하려고 해서 그런듯 하다. 
따라서 cache 혹은 refetch를 쓸거면 Query문을 구분지어줘야 한다. 즉, 매번 다른 Query를 던져줘야 나중에 cache를 쓸 때에도 원활한 것.
혹은 useLazyQuery 함수로 해결될 것이다. 그러나 매번 던져야 한다는게.. 그러면 Apollo Client를 쓰는 의미가 없다ㅋㅋ. 

container의 contents에 대한 Query문이 서버쪽에서 있어야 한다고 생각한다. 

애초에 이거 지금 container의 contents만 받아올려고 하는데 무겁게 전체 subject를 Query해야되는거잖아?

## 특정 시점마다 Mutation
useEffect의 dependency에 대한 이해 부족이 원인.
선택지
1. contentText를 dependency로 하는 useEffect를 실행. contentText가 서버로부터 온 이후에 바뀐 경우, 즉 유저가 수정을 하려고 한 경우에 실행. setTimeout을 실행해도 되나. 바깥 scope에서 정의한 변수를 하나 올리고, 그게 1인 동안은 setTimeout실행 안함. 그리고 지정한 시간이 끝났을 때 Mutation요청을 던진다.
2. Router params의 containerTitle을 dependency로 하는 useEffect 실행. 그렇지 않으면 containerTitle이 바뀐 뒤에도 이전의 state를 요청으로 넣을 것이다.

로직
1. setInterval을 실행하는 시점은 처음 페이지가 mounting되거나 containerTitle이 바뀌었을 때다. 
container이 바뀌었는데도 마운팅 되었을 때의 state를 갖고 요청을 하게 되기 때문. 
1. Mutation에는 3개의 변수를 쓰고 있다. 컨테이너를 구분하기 위한 subjectId와 containerTitle, 그리고 contentText. 이 변수들을 정의한 이후에 함수를 실행해야 한다.
2.  

## CSS가 없어서 쓸 맛이 안 난다.
사실 없어도 그만 있어도 그만이기는 하다. 그러나 실제로 내가 쓰고 있다는 느낌을 주기 위해서 최소한은 꾸며야겠다.

## React에서 깜빡거림은 수치다.
디테일 페이지에서 url을 바꿀 때마다, 화면이 깜빡거린다. 원인을 찾아야 할 듯하다. refetch때문인지, setState때문인지.

## state를 쓰는 로직이 뒤죽박죽~
관계와 순서를 확실히 해둬야 한다. 정말 필요한 state만 있는지, 엉뚱한 state값을 참조하고 있지는 않은지 확실히 하고 넘어가야 한다.

## 클릭과 더블클릭을 구별하기 위한 0.15초
setTimeOut은 쓸데없이 시간을 잡아먹을 수 있다. data를 fetching하는 것도 아닌데 0.2초를 기다려야 한다는건 미개할 수 있다. 다른 것도 아니고 더블클릭인지 클릭인지만 확인하는 것 때문에. 흐음.
- onClick의 call back함수에선 더블클릭함수를 호출하지 말까? 그냥 카운트만 많이 쌓이면 취소하는 식으로? 
- 이건 문제 해결의 본질이 아니다. setTimeOut의 시간이 걸리적거린다는게 문제의 핵심이다 지금.

## onKeyDown 함수화
onKeyDown의 callback함수들이 다 똑같이 생겼다. 그런데 지금은 한땀한땀 쓰고 있다. 나중에 onKeyDown을 야무지게 쓰려면, event.key에 따라 분기처리를 해서 하나의 함수로 만들면 될 듯하다. 여러번 쓸 수 있게.

## event 함수를 Hook화하기  
- state가 아닌 해당 element의 정보를 인자값으로 하는 함수의 경우 어떻게 함수로 만들어야 할 지 모르겠다. 특히 그 안에서 useMutation의 함수를 써야할 때, Hook을 쓰기 힘든 듯 하다. useMutation을 Hook으로 만드는 법을 더 배워야 겠다.

## refetch 이해 부족
- 대체 왜 project를 refetch하는데 projects에서 반영되는거야? 개신기하네.
- projects Query가 project Query이후에 실행되는게 분명한데, 지금 명확하게 구조 파악이 안되어서 그럼.
- refetch를 하면 서버로 요청하는 비용이 얼마나 나는지 궁금하다. graphQL을 이해해야 알 수 있을 문제.

## 토큰 유효성 검사 과정에서 data fetch 최소화하기
- 지금은 me Query로 해당 토큰이 유효한지 확인해야 한다. 그러나 난 요청을 최소한으로 하고 싶다. token의 진위여부를 확인하는 다른 방법이 없을까?

## 토큰 유효기간에 대해 실시간으로 반응하기
- token이 expired될 때 실시간으로 token을 삭제하고 페이지에서 그 변화를 인식하는 방법 ?


# 문제 해결

## box와 eventListener
1. useEffect : Query문의 data인 subjects_index를 setState
2. state에서 map() : string값을 가진 각각의 span을 렌더링한다
3. map() : 그 갯수만큼의 box element를 따로 렌더링. 순서만 갖고 있음.
4. eventListener : 특정 box안에서 drag가 끝나는 시점에 함수 호출. 인자값으로 string값과 순서를 가짐. 그전에 string값을 인식해야겠지. state든 event.target.innerText든.
5. 함수 : box의 순서를 기준으로 기존의 subjects_index의 string값들을 비교.
6. 로직 : 화면상의 clientX는 이제 잊자. box의 순서를 기준으로 string값이 바뀌었을 경우, splice()를 이용해서 바뀐 array를 setState, Mutation문 실행. 여기서 Mutation문을 실행할 때 state로 해야 할지 array값을 바로 넣을지는 모르겠다.
7.  setState : box element에서 drag 대상의 string값을 알 방법이 없다. 따라서 drag를 시작할 때 해당 string값을 setState로 할당했다. 다른 좋은 방법이 있을까?

## 순서 문제 : subjects_index 로직
1. 완전 동일한지 체크 : 우선 두 index가 완전히 같으면, 순서 비교의 의미가 없어지므로 함수 종료.
2. 길이가 다른지 체크 : 두 index안의 property갯수가 다를 경우, 최소한 원래 있던게 없어지거나 원래 없던게 새로 생긴 것이기 때문에 함수 종료. 이건 Subject를 삭제 혹은 추가하는 Mutation이 아니므로.
3. 값이 바뀌었을 경우 : 기존 index에 없던 값이 새로운 index에 있을 경우 함수 종료.
4. 중복된 경우 : 새로운 index안에서 서로 중복되는 카운트가 그 index의 길이보다 많을 경우 함수 종료.
5. 이렇게 해서 기존에 있던 값이 없어지는 경우 혹은 없던게 생기는 경우를 방지한다.
? : 이렇게 해도 나 스스로가 이해가 덜 됐다. 솔직히 끼워맞추기 식인거 같고. 이런거 준내게 해봐야겠다. 알고리즘인가 이게. 나중에 일이 어려워진다면 이런데서 많이 막힐 것 같다.

## drag 큰 그림
0. 야바위 로직에 필요한 정보 : 1. 옮겨질 string값, 2. 옮길 자리의 순서값, 3. 옮길 순서의 string값.
1. Query문 data의 subjectsIndex
2. map() : 각각의 sub를 drag 대상 props의 children으로. 즉 렌더링.
3. map() : 그 갯수만큼 index를 box props의 id로. 
4. onDragStart : drag 대상 chidren의 string값을 event.target.innerText로 인식.
5. 그 값을 setState. 화면 상에서 계속 변할 수 있기 때문에 state로 한다. 또한 global scope에 두기 위해서. 
6. onDrop : box props의 id값을 event.target.id로 인식. 
7. drag할 string값 state를 여기서 인식함. onDrop의 callback이 onDragStart 이후이고, onDragEnd 이전이기 때문.
8. 로직 정보를 얻는 구체적인 단계 : 1. state의 string값을 인식한다. 2. 옮길 자리의 순서값은 box의 id로 인식한다. 3. 처음 받은 data의 subjectsIndex[]안에다가 box의 id값을 넣어서 string값을 얻는다.
9. 첫번째 splice() : 기존의 string값이 있던 자리의 값을 없앤다. 그에 따라 그 뒤의 array 값들이 앞으로 한 칸씩 땡겨지는 셈이 된다.
10. 두번째 splice() : 옮겨질 자리에다가, 원래 그 자리에 있던 string값은 가만히 냅두고, 옮길 string값을 넣는다. 그에 따라 그 뒤의 array값들이 뒤로 한 칸식 밀리는 셈이 된다. 이렇게 해서 기존의 array를 해치지 않고 string값들의 순서를 하나씩 바꿀 수 있게 된다.
### 더 생각
1. 그러고 보니 box쪽의 onDrop이 drag된 element의 onDragEnd보다 더 빨리 인식되는건가? 빈 string값으로 setState하기 전에 인식하는 듯 하다. onDragEnd의 호출 함수보다는 다른 곳에서 setState하는게 더 좋을 듯하다.
2. onDragEnd 이전에, onDragStart에서 setState한 값이 onDrop까지  유지되는 것은 call stack의 영향인가?

## 클릭과 더블 클릭
1. onClick : eventListener
2. 클릭의 count를 변수로써 만들고, 함수가 onCLick의 call back함수가 실행될때마다 count를 1씩 올린다.
3. setTimeOut() : 더블 클릭임을 인식할 기간을 정해둔다. 지금은 0.15초. 또한 함수의 execution context와 별개로 setTimeOut상의 execution context를 만든다는 것이 중요하다.
4. 그 시간동안 싱글 클릭의 효과는 일단 무효화
5. 그 시간동안, outerReference의 clickCount 변수값을 참조하여 로직을 돌린다.
6. 2이상일 경우, 즉 더블클릭의 조건이 충족되었을 경우 더블클릭의 함수를 호출하여 실행한다. 그리고 clickCount를 0으로 만든다.
7. **scope 원리** : 이때, clickCount는 setTimeOut의 scope에서만 유효한 변화를 얻게 된다. 따라서 그 시간동안 몇번을 눌렀던지 간에, 주어진 시간동안은 setTimeOut scope만의 값을 가질 수 있다. outerReference의 clickCount가 몇인지 상관없이, 더블클릭 함수실행 이후에는 clickCount가 0이 되는 것.
8. 1일 경우, 즉 싱글클릭의 조건이 충족되었을 경우 싱글클릭의 함수를 호출하여 실행한다. 그리고 clickCount를 0으로 만든다.
9. 0일 경우, setTimeOut의 callback함수 실행 자체를 종료한다. 이 로직이 중요하다. setTimeOut scope상의 변수 값을 인식하고 이용한다는 것.그리고 함수가 두번씩 실행되는 것을 막는다는 것.
10. 이렇게 해서 싱글클릭 함수와 더블클릭 함수가 한 번씩만 실행될 수 있도록 했다. 
### 더 생각
- 확실히 어떤 문제를 만나든 간에, 그것의 **핵심을 파악하고 단순화해서 생각하는 것이 선행 과제이다**. 그렇지 않으면 몇시간이고 해봤자 나중에 와서 보면 이상한 삽질을 하고 있게 된다.
- eventListener과 window의 힘이 어디까지인지가 아직 갈피가 안 잡힌다. 그래서 처음엔 혹시나 더블클릭 이전에 onClick eventListener자체를 막을 수 있는 함수가 있을까 하고도 생각했다. 
- call back과 scope를 이해하고 가는 것이 너무나도 중요하다.
- **로직을 짜는 실력이 너무나 부족**하다. 직감적으로 문제를 해결하려는 것부터가 문제다 내가 볼 땐. 문제가 생기기 전에, 내가 미리 구도를 짜서 어떤 문제가 생길 것인지 알 수 있어야 한다. 그래야 미리 에러를 막는 방법도 알 것이다. 

## 한 페이지에서 두 params 갖기
1. Route : 하나만 쓴다. 프로젝트에는 무조건 하나의 subject가 선택되는 것으로 약속했으므로.
2. dynamic url : `:`기호를 써서 여러가지 url로 갈 수 있도록.
3. 각각의 subject 칸은 Link로 감싸져있고, 누르면 해당 url로 이동한다.
4. 메인페이지의 projects Query문에선 subjects_index의 data가 없다.그러면 처음 프로젝트를 누를 때, 첫번째로 주어지는 subject를 어떻게 인식하지? useEffect()로 마운팅 단계에서 해당 subject 링크로 가야 하나?
5. useHistory : html의 기본 history를 쓰는거ㅎ

## 이름바꾸기와 url params
현재 페이지를 구성하는 subject의 이름을 바꾼 후에는 기존의 url이 무의미해진다. 
- history.replace()로 아예 url값을 바꿈.

## 왠만하면 라이브러리 쓰지 말자.
react-draggable이라는 라이브러리를 썼는데, 한 번 관련 에러가 나는 순간 그 에러가 어디에 의거하고 있는지 알기 힘들다. 일단 오래 걸리더라도 차근 차근, window object를 최대한 활용해서 만들자. html의 기본 props와 React의 props, 그리고 window는 충분히 많은 정보를 담고 있다. 쓰는 사람의 몫.
1. 드래그할 대상이 마우스에 따라오는 반응이 느리다. 
: 바로 밑의 childrend의 className을 넣으면 안 된다는 draggable의 특성 
2. 가끔 전체가 반응될 때도 있다. react-draggable의 이해도가 부족한 문제인 듯 하다.
: 이건 그냥.. style을 인위적으로 바꿨기 때문. 바뀐 style이 드래그 하는 순간 원래대로 돌아오고, 마우스는 전체 div를 그랩하는것일 뿐이다.
3. draggable이 아닌 내가 직접 만든 element라면 어디서부터 원인이 시작되는지 알 수 있지 않을까? draggable을 쓰는건 그 이후이다. 

## token 관리와 요청
1. token을 통한 요청 : token을  request Headers로 어떻게 보내는가? authLink와 setContext
2. token 관리 : token을 어디서 저장하고 있어야 할까? : Context API 혹은 cache? 지금은 makeVar 함수를 통해 전역 변수로 선언하여 쓰고 있다. 

## 에러 핸들링
 에러 핸들링 : 로그인에 문제가 있을 때 graphQL서버쪽에서 주는 에러는 어떻게 처리하면 좋을까? try&catch와 graphQLError

## 전역 state
1. Context API 
2. makeVar과 변수 값 할당 : 로그인 직후에 history.push()를 통해 메인페이지로 가면, request Headers에 토큰이 담기질 않았다. 따라서 로그인 함수 안에서 ApolloClient에서 makeVar로 선언했던 전역 변수에다 token 값을 할당했다. 애초에 error을 인식하려고 했으면 원인을 훨씬 더 빨리 찾아냈을 것.

## Router에서 토큰 체크
5. Router에서의 분기 처리 : 토큰 여부에 따른 분기처리를 각각의 페이지에서 하기가 싫었다. 그래서 아예 Router에서 전역 token 변수를 인식한 다음 Redirect component를 만들었다.

## error : cannot read property of undefined
- `? :` operator : array의 length를 인식하기 전에 그 array가 있는지부터 확인해야 한다. object도 마찬가지다. property를 인식하려면 그 object가 있는지부터 확실히 해야 함.

## 버튼 디자인
1. 수정 버튼을 따로 놓는게 좀 ㅄ같다 : notion처럼 제목 칸을 아예 인풋으로 만들기. 따로 수정 버튼 필요 없이 누르기만 하면 수정이 되는거임.

## JSX 안의 JS
1. className을 JS스럽게 manipulate하기 : className안에서 {`${}`}식으로 JS표현을 쓰면 끝. state의 값에 따라서 값을 바꿨다.
2.  방금 생성한 투두에만 animation을 적용하고 싶다. : 서버에서 온 createdAt data를 이용해서 new Date()와 비교한다 ㅋㅋㅋㅋ. 1초 이하 이전에 생긴거에 한해서 animation효과를 준다.  


# 전제 : 프로젝트의 목적
0. 우리의 목적 : 우선 기존의 협업툴이라는 목적에 회의감을 느꼈다. 우선 다른 협업툴들에 적응해서 쓰다가 불편한 점이 발견되면 그 때 우리만의 협업툴을 만드는 것이 순서라고 생각하기 때문이다. 지금 아무리 협업툴을 만들려고 해도, 이건 망상에 불과하다. 그리고 우리의 목적은 협업툴 개발자가 되는 것이 아니다. javascript 서버와 클라이언트를 잘 구현하는 개발자가 되는 것이 목적이다. 그러므로 협업툴을 만든다고 해도 그건 기존의 것들을 클론하는 것이 되어야 한다. JS실력을 키울 목적으로만.
1. 직접 만들어가는 것이 뿌듯하기는 하다. 왜 기존의 협업툴들이 그런 기능을 가져야만 하는지, 왜 이런 기능은 없는지 알 수 있게 된다는 장점.
2. 포스트 형식과 포트폴리오 : CRUD와 authentication을 연습할 대상으로 충분하다고 생각한다. 하나의 포스트에도 많은 헤더가 들어갈 것이다.
3. 투두 리스트와 프로젝트 로드맵 : 그래도 우리가 공유하는 프로젝트에 대해서 할 일을 공유하는 기능은 나쁘지 않다고 생각한다. 그리고 그런 투두들이 모여서 프로젝트 전체의 흐름을 나타낼 것이다. 물론 다듬어야 겠지만. 나중에 투두들을 로드맵화 하는 기능을 만들고 싶다.
4. 문제점 혹은 몰랐던 점 리스트 : 프로젝트를 실제로 구현하는 과정에서 구상했을 때와 달리 어떤 문제들이 있었는지 나열한다. 
5. 문제 해결 리스트 : 우리는 그런 문제들을 어떤 방식으로 해결했는지 나열한다. 사실 이게 가장 중요하다고 생각한다. 포트폴리오의 질이니깐.
6. 스레드 기능 : 각자의 포스트, 투두 등에 다른 유저의 반응이 생기면, 그에 대한 알림을 줄 수 있어야 한다. 
7. 프로젝트의 contributors : 프로젝트를 공유하는 팀의 구성원들을, 프로젝트 칸에서 알 수 있도록 해야 한다. 이쯤 되면 깃허브와 비슷해진다. 보기 더 편한 깃허브가 되어간다. 


# 전제 : npm packages
1. react
2. react-dom
3. react-router-dom : 페이지를 여러개로 나눌 생각이다.
4. @apollo/client
5. graphql
6. graphql-tag
7. 함수형 component : Hook들을 쓰기 위함.


# 전제 : 구상
1. reactDom.render() : React요소들을 렌더링하기 위한 첫번째 전제. DOM node에다가 가상 DOM을 넣어준다. 
2. BrowserRouter, Switch, Route,  : 로그인 페이지, 메인 페이지로 나눈다.
3. createHttpLink와 client : graphQL 서버에 연결되기 위한 전제. 링크를 uri라는 이름으로 넣어서 연결한다.
4. ApolloProvider : 전체 Router을 아폴로클라이언트 API로 감싸준다.
5. gql : graphQL서버가 알아들을 수 있도록 gql tag를 써서 Query문과 Mutation문을 정의한다.
6. useQuery
7. useMutation

# 서버의 역할에 대하여
- 로그인 : admin의 column에 isLoggedIn과 같이 현재 로그인이 된 상태인지 아닌지를 알 수 있는 boolean값 data가 필요하다. 지금 이건 사실상 Query이다. 서버에서 로직을 처리할 뿐, 단순히 토큰을 받아오는 작업이기 때문. 
- 업데이트의 기준 : updatedAt이란 column의 업데이트 기준은 뭘로 하는게 좋을까? 유저가 로그인을 했을 때? 유저의 정보가 바뀌었을 때? 
- 로그인 시도 횟수 제한 : fail_count라는 column을 서버쪽에서 이용해서 로직을 처리하기는 하지만, 나는 아예 DB쪽이 잠겼으면 좋겠다. 불가능한가?

# 페이지
## Login
- 구상 : 토큰이 없을 경우에 무조건 들어오게 되는 페이지.
- component : Header, LoggingForm, Link를 쓴다.
- submit 로직
1. Mutation 호출 함수 : ok, error, data를 받는다. data의 token을 state로써 저장한다.
2. try&catch : error를 받는 경우, throw new Error(). 에러 메세지를 가져온다.
3. finally ? 

- 렌더링 로직
 1. 이름과 패스워드의 state가 우선 비어있지는 않은지 확인하고 띄운다.
 2. DB에 유저가 없을 경우, 에러 메세지를 프론트에 띄운다.

## Register
- 구상 : graphQL Schema쪽에서 요구하는 validation을 프론트에서 한 번 더 확실하게 한다.
- component : Header, LoggingForm, Link
- submit 로직

## Main
# 컴포넌트

## LoggingForm
1.  form : 아이디와 비밀번호를 받는 input을 가진다. 
2.  onChange : event.target.value를 state에다가 담아야 한다.
3.  useState : 아이디와 비밀번호를 리액트쪽에서 다루기 위해 state를 정의한다. 디폴트는 둘 다 "".
4. onSubmit : 아이디와 비밀번호를 인풋값으로 넣는 mutation문을 호출하는 함수를 실행한다. 인자값이 필요할까?
5. gql : graphQL서버쪽에서 정의한 Schema와 Resolver에 맞도록 Mutation문을 정의한다.
6. useMutation : 만들어놓은 muation문을 인자값으로 넣고, 실행 함수를 정의하고 loading, data를 destructure한다. 
7. handleSubmit : useMuation에서 정의한 함수를 실행한다. 여기서 조건문과 try&catch 블럭이 필요하다. graphQL쪽으로부터 에러를 받아야 하기 때문. 

