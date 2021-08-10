export const validateName = (value) => {
  // const stripSpecChars = value.replace(/\W|_/g, '');
  const stripNumbers = value.replace(/[0-9]/g, '');
  const noSpecialChars = stripNumbers.replace(/[^a-zA-Z ]/g, '');
  const oneSpace = noSpecialChars.replace(/\s\s/, ' ');
  const noStartSpace = oneSpace.replace(/^\s/, '');

  return noStartSpace;
};
