export const checkRegularExpression = (expression, value) => {
  const regex = new RegExp(expression);
  return regex.test(value);
};

export const isValidState = (value) => {
  return checkRegularExpression(
    /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/,
    value
  );
};

// eslint-disable-next-line no-unused-vars
export const isValidUsername = (value) => {
  /**
   * This regex generates error 'invalid regular expression'
   * change to something else
   */
  // return checkRegularExpression(
  //   /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
  //   value
  // );
  return true;
};

export const isValidZipCode = (value) => {
  return checkRegularExpression(/(^\d{5}$)|(^\d{5}-\d{4}$)/, value);
};

export const isValidEmail = (value) => {
  return checkRegularExpression(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //eslint-disable-line
    value
  );
};

export const isValidPhone = (value) => {
  return checkRegularExpression(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/, value);
};

// eslint-disable-next-line no-unused-vars
export const isValidWebsite = (value) => {
  // return checkRegularExpression(
  //   /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, //eslint-disable-line
  //   value
  // );

  /**
   * TODO: change regex so it checks valid IP for portal addresses
   */
  return true;
};

export const isValidExpirationDate = (value) => {
  return checkRegularExpression(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, value);
};

export const isValidName = (value) => {
  return checkRegularExpression(
    /^(?=\S+)(?=[a-zA-ZàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð ,.'-]*$).*(?=\S).$/,
    value
  );
};

export const isValidPassword = (value) => {
  return checkRegularExpression(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/, value);
};
