// ! : state로 만들어줘야 함. 스크린 상에서 움직이므로.
// ? : 언제 setState를 하면 좋을까?
// ? : 가끔 버그 나면 페이지의 모든게 드래그된다. 이거 막아야 됨.
const handleDragStopFucked = (event, index) => {
  // subject의 string값.
  const { clientX, target } = event;
  const { children } = dragRef.current;

  console.log(children[0].innerText);
  console.log(event.target);

  // 함수 정의 : 기존 위치값을 return함.
  const prevPosition = (arg) => {
    // ? : infinity로 메꾸는건 미개하다. 더 좋은 방법이 있을거야
    // if : 0번째보다 이전이거나 마지막번째보다 이후라면 무조건 되도록
    if (arg < 0) return -Infinity;
    if (arg === children.length) return Infinity;
    return children[arg]?.offsetLeft;
  };

  // ? : 이거 왜 평소처럼 위치가 안 바뀌지? 내가 놓치고 있는게 있는듯.
  // 그래도 이렇게 style을 바꾸니깐 원래의 위치 즉 offsetLeft가 바뀐다.
  // target.style.transform = "translate(100px, 0px)";

  // 해당 순서 text의 원래 위치 값
  // ? : 위치가 계속 바뀌는데 반해서 원래 위치는 새로고침을 하지 않는 이상 고정이다.

  // index가 곧 앞에 있는 subject의 갯수.
  // 현재 뒤에 있는 subject의 갯수.

  // 함수 정의 : 각각 앞과 뒤의 순서로 값을 넣어줌.
  const nextSplicing = (arg) => {
    // immutable : state를 바로 바꾸면 안되기 때문에 여기서 splice
    const fuck = [...newSubjectIndex];
    // 원래 자리의 값을 제거한다.
    fuck.splice(index, 1);
    // 대상 위치에다가 그 값을 추가한다.
    fuck.splice(index + arg, 0, children[index].innerText);
    return fuck;
  };
  const prevSplicing = (arg) => {
    const fuck = [...newSubjectIndex];
    fuck.splice(index, 1);
    fuck.splice(index - arg, 0, children[index].innerText);
    return fuck;
  };

  // if : 만약 위치가 양옆의 기존값보다 작을 경우, 즉 안 움직였을 경우
  if (
    clientX <= prevPosition(index + 1) &&
    clientX >= prevPosition(index - 1)
  ) {
    console.log("not moved!");
    return;
  } else if (clientX > prevPosition(index + 1)) {
    // for : i라는 변수 정의하고, 뒤 혹은 앞에 남아있는 만큼 반복.
    for (let i = 1; i < children.length - index; i++) {
      if (
        clientX > prevPosition(index + i) &&
        clientX < prevPosition(index + 1 + i)
      ) {
        // ! : 실행컨텍스트가 아직 안 끝났으므로 처음 인자 값은 그대로다.
        console.log(`it is now ${index + i + 1}th !`);

        const spliced = nextSplicing(i);
        console.log(spliced);

        setNewSubjectIndex(spliced);
        console.log(newSubjectIndex);
        editSubjectsIndexSubmit(spliced);
      }
    }
  } else if (clientX < prevPosition(index - 1)) {
    for (let i = 1; i <= index; i++) {
      if (
        clientX < prevPosition(index - i) &&
        clientX > prevPosition(index - 1 - i)
      ) {
        console.log(`it is now ${index + 1 - i}th !`);

        const spliced = prevSplicing(i);
        console.log(spliced);

        setNewSubjectIndex(spliced);
        console.log(newSubjectIndex);
        editSubjectsIndexSubmit(spliced);
      }
    }
  } else {
    console.log("뭐하는 새끼니?");
    return;
  }
};
