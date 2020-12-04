export const createFontFormat = (fontSize, lineHeight) => {
  return { fontSize, lineHeight };
};

export const urlEncodeTitle = (title) => {
  const strsplit = title.split();
  return strsplit.join('+');
};
