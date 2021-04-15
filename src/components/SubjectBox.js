import React from "react";

const SubjectBox = ({ children, createdAt }) => {
  // 함수 선언 : 틸트인 animation
  const tiltInAnimation = (createdAt) => {
    if (new Date().getTime() - Date.parse(createdAt) < 1000) {
      return "tilt-in-tl 1s cubic-bezier(0.750, 0.460, 0.450, 0.940) both";
    } else return null;
  };
  return (
    <div
      className=" mx-2 my-2 w-64 min-h-full bg-yellow-500 bg-gradient-to-br from-yellow-300 shadow-xl "
      style={{
        // ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
        animation: tiltInAnimation(createdAt),
      }}
    >
      {children}
    </div>
  );
};

export default SubjectBox;
