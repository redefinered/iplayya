export const urlEncodeTitle = (title) => {
  const strsplit = title.split();
  return strsplit.join('+');
};
