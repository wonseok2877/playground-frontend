import React from "react";
import { Link } from "react-router-dom";
import LargeText from "./texts/LargeText";

const LoggingForm = ({
  handleSubmit,
  handleChange,
  info: { name, password },
  message: { idMessage, passwordMessage, errorMessage },
}) => {
  console.log(errorMessage);
  return (
    <>
      <div className="flex flex-col justify-evenly items-center m-auto w-7/12 h-full bg-yellow-500">
        <LargeText>로그인</LargeText>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-evenly items-center w-full h-52"
        >
          <input
            value={name}
            // trim()
            onChange={(e) => handleChange.checkId(e.target.value.trim())}
            type="text"
            className=" w-7/12 h-14 text-3xl pl-4 border-4 rounded-xl border-black"
          />
          {idMessage ? (
            <h3 className="bg-red-400 text-center text-xl w-10/12">
              {idMessage}
            </h3>
          ) : null}

          <input
            value={password}
            onChange={(e) => handleChange.checkPassword(e.target.value.trim())}
            type="password"
            className=" w-7/12 h-14 text-3xl pl-4 border-4 rounded-xl border-black"
          />
          {passwordMessage ? (
            <h3 className="bg-red-400 text-center text-xl w-10/12">
              {passwordMessage}
            </h3>
          ) : null}
          {errorMessage ? (
            <h3 className="bg-red-400 text-center text-xl w-10/12">
              {errorMessage}
            </h3>
          ) : null}

          <button type="submit" className="w-7/12 h-1/6 rounded bg-green-600">
            Submit
          </button>
        </form>
        <Link
          to="register"
          className="pt-4 w-5/12 h-16  text-center text-2xl text-white bg-blue-400 rounded"
        >
          새 계정 만들기
        </Link>
      </div>
    </>
  );
};

export default LoggingForm;
