export const updateDownloadsCollection = (state, action) => {
  const { downloadTask } = action;

  const { downloads } = state;
  const dupeIndex = state.downloads.findIndex(({ id }) => id === downloadTask.id);

  if (typeof dupeIndex >= 0) {
    downloads.splice(dupeIndex, 1, downloadTask);
    return downloads;
  }

  return [downloadTask, ...downloads];
};
