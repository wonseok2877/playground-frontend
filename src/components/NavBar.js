import { useReactiveVar } from "@apollo/client";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { authTokenVar, removeToken } from "../apolloClient";

const NavBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // useReactiveVar : 로그인 상태에 따라서 header에 띄울게 달라짐.
  const authToken = useReactiveVar(authTokenVar);
  console.log(isUserMenuOpen);
  return (
    <>
      <div className="px-2 py-1 flex justify-between items-center bg-gradient-to-r from-green-400 to-blue-400">
        <Link to="/">
          {/* <i className="fas fa-home text-7xl"></i> */}
          <div
            style={{
              fontFamily: "Arbutus Slab, serif",
              fontSize: "50px",
            }}
          >
            <span>play</span>
            <span className="keyframes-slide-out-right inline-block">.</span>
            <span className="keyframes-appear">ground</span>
          </div>
        </Link>
        <i
          className={`fas fa-bars fixed right-0 z-20 text-3xl mr-5 cursor-pointer ${
            isUserMenuOpen && "keyframes-rotate-down"
          }`}
          onClick={() =>
            isUserMenuOpen ? setIsUserMenuOpen(false) : setIsUserMenuOpen(true)
          }
        ></i>
        <div
          className={`fixed z-10 w-48 h-72 px-1 py-10 right-0 -top-52 opacity-0 flex flex-col justify-between bg-white rounded-lg
            ${isUserMenuOpen && "keyframes-slide-bottom"}`}
        >
          {authToken ? (
            <div>
              <Link to="/admin/info">
                <h2 className="text-2xl">내 정보</h2>
              </Link>
              <button
                onClick={(e) => {
                  removeToken();
                }}
              >
                log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default NavBar;
