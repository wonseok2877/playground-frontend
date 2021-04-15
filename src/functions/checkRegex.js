const checkRegex = (string) => {
  // regex 정의 : 대문자와 특수문자 적어도 한 개씩
  const checkSpecial = /[*@!#%&()^~{}]+/.test(string);
  const checkCapital = /[A-Z]/.test(string);
  // conditional : 최소한 한개씩의 대문자, 특수문자가 들어가도록.
  if (!checkCapital) {
    return false;
  }
  if (!checkSpecial) {
    return false;
  }
  return true;
};

export default checkRegex;
