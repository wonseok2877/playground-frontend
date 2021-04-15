import React from "react";
import { Link } from "react-router-dom";
import LargeText from "./texts/LargeText";
import MediumText from "./texts/MediumText";

const RegisteringForm = ({
  handleSubmit,
  handleChange,
  info: { name, password, confirmPassword },
  message: { idMessage, passwordMessage, confirmPasswordMessage, errorMessage },
}) => {
  return (
    <>
      <div className="bg-black h-screen">
        <div className="flex flex-row  justify-center items-center h-screen">
          <div className="flex flex-col items-center w-9/12 h-5/6 rounded-lg bg-yellow-500">
            <LargeText>회원가입</LargeText>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-evenly items-center w-full h-full"
            >
              <div>
                <MediumText>아이디</MediumText>
                <input
                  value={name}
                  // trim()
                  onChange={(e) => {
                    handleChange.checkId(e.target.value.trim(""));
                  }}
                  // onBlur : 포커스 아웃될 때 함수 실행
                  type="text"
                  className=" h-full text-3xl pl-4 border-4 rounded-xl border-black"
                />
                {idMessage ? (
                  <h3 className="bg-red-400 text-center text-xl">
                    {idMessage}
                  </h3>
                ) : null}
              </div>
              <div>
                <MediumText>비밀번호</MediumText>
                <input
                  value={password}
                  onChange={(e) => {
                    handleChange.checkPassword(e.target.value.trim(""));
                  }}
                  type="password"
                  className=" h-full text-3xl pl-4 border-4 rounded-xl border-black"
                />
                {passwordMessage ? (
                  <h3 className="bg-red-400 text-center text-xl">
                    {passwordMessage}
                  </h3>
                ) : null}
              </div>
              <div>
                <MediumText>비밀번호 재확인</MediumText>
                <input
                  value={confirmPassword}
                  onChange={(e) => {
                    handleChange.checkConfirmPassword(e.target.value.trim(""));
                  }}
                  type="password"
                  className=" h-full text-3xl pl-4 border-4 rounded-xl border-black"
                />
                {confirmPasswordMessage ? (
                  <h3 className="bg-red-400 text-center text-xl">
                    {confirmPasswordMessage}
                  </h3>
                ) : null}
              </div>
              {errorMessage ? (
                <h3 className="bg-red-400 text-center text-xl">
                  {errorMessage}
                </h3>
              ) : null}
              {idMessage || passwordMessage || confirmPasswordMessage ? (
                <button
                  disabled
                  type="submit"
                  className="opacity-30 cursor-not-allowed w-4/12 h-1/6 rounded bg-green-600"
                >
                  Submit
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-4/12 h-1/6 rounded bg-green-600"
                >
                  Submit
                </button>
              )}
            </form>
            <Link
              to="login"
              className="pt-4 w-5/12 h-24  text-center text-2xl bg-pink-300 text-blue-400 rounded"
            >
              이미 가입되어 있으신가요 ? 로그인
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisteringForm;
