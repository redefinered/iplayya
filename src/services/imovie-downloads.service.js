import client from 'apollo/client';
import { GET_DOWNLOADS } from 'graphql/movies.graphql';
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';
import { downloadPath } from 'utils';

export const deleteFile = async (filename = null) => {
  if (!filename) return;
  try {
    await RNFetchBlob.fs.unlink(`${downloadPath}/${filename}`);
  } catch (error) {
    console.log(`Delete file error: ${error.message}`);
  }
  // eslint-disable-next-line no-unused-vars
  const ls = await RNFetchBlob.fs.ls(downloadPath);
  console.log('remaining files after delete', ls);
};

export const checkExistingDownloads = async () => {
  try {
    return await RNBackgroundDownloader.checkForExistingDownloads();
  } catch (error) {
    console.log(error);
  }
};

export const listDownloadedFiles = async () => {
  try {
    return await RNFetchBlob.fs.ls(downloadPath);
  } catch (error) {
    console.log(error);
  }
};

export const getDownloads = async (videoIds) => {
  try {
    const { data } = await client.query({
      query: GET_DOWNLOADS,
      variables: { input: { videoIds } }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
