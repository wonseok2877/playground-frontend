import { useReactiveVar } from "@apollo/client";
import { Link } from "react-router-dom";
import { authTokenVar, removeToken } from "../apolloClient";

const Header = ({ children }) => {
  // useReactiveVar : 로그인 상태에 따라서 header에 띄울게 달라짐.
  const authToken = useReactiveVar(authTokenVar);
  return (
    <>
      <div className="flex justify-between bg-gradient-to-r from-yellow-500 to-blue-400">
        <Link to="/">
          <i className="fas fa-home text-7xl"></i>
        </Link>
        {children}
        {authToken ? (
          <div>
            <Link to="/admin/info">
              <h2 className="text-5xl">Info</h2>
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
    </>
  );
};

export default Header;
