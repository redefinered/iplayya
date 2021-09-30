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

export const removeFinishedDownloads = (state, action) => {
  const { ids } = action;
  const downloadsProgress = state.downloadsProgress;
  let incompleteItems = [];
  ids.forEach((removeId) => {
    incompleteItems = downloadsProgress.filter(({ id }) => id !== removeId);
  });

  return incompleteItems;
};

export const removeDownloadsByIds = (state, action) => {
  let { downloads } = state;
  const { ids } = action;
  ids.forEach((id) => {
    let index = downloads.findIndex(({ movie }) => movie.id === id);
    console.log({ index, downloads, ids });
    if (index >= 0) {
      downloads.splice(index, 1);
    }
  });

  return downloads;
};
