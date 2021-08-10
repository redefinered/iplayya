export const validateName = (string) => {
  const stripNumbers = string.replace(/[0-9]/g, '');
  const noSpecialChars = stripNumbers.replace(/[^a-zA-Z ]/g, '');
  const oneSpace = noSpecialChars.replace(/\s\s/, ' ');
  const noStartSpace = oneSpace.replace(/^\s/, '');

  return noStartSpace;
};
