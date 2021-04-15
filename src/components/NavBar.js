import React, { useContext } from "react";
import { stateContext } from "../context/stateContext";

const NavBar = () => {
  // useContext : 어느 페이지에서든 내비게이션 바에 대한 state를 공유함.
  const { isSideBar, setIsSideBar } = useContext(stateContext);

  // ? : refetch가 바로 반영 안 될때가 있다. 원인이 뭘까?
  return (
    <>
      <button
        onClick={() => setIsSideBar(isSideBar ? false : true)}
        className="fixed z-50 top-20 h-10 bg-purple-600 bg-opacity-80 rounded-xl"
      >
        사이드 바
      </button>
      <div
        className={`${
          isSideBar ? "" : "-translate-x-32 "
        } absolute transform transition-all ease-in-out duration-700 pt-20 bg-gray-500 bg-opacity-90`}
      >
        <h1>내비게이션 바</h1>
      </div>
    </>
  );
};

export default NavBar;
