import { useReactiveVar } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { authTokenVar, removeToken } from "../apolloClient";

const NavBar = () => {
  // useState
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // useReactiveVar : 로그인 상태에 따라서 header에 띄울게 달라짐.
  const authToken = useReactiveVar(authTokenVar);
  return (
    <>
      <section
        className="fixed top-0 w-screen z-50 px-4 py-1 flex justify-between items-center "
        style={{ backgroundColor: "#032F38" }}
      >
        <Link to="/">
          <h1
            style={{
              fontFamily: "Arbutus Slab, serif",
              fontSize: "23px",
              color: "whitesmoke",
            }}
          >
            <span>play</span>
            <span className="keyframes-slide-out-right inline-block">.</span>
            <span className="keyframes-appear">ground</span>
          </h1>
        </Link>
        <i
          className={`fas fa-user right-0 z-20 text-3xl text-white cursor-pointer `}
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
      </section>
    </>
  );
};

export default NavBar;
