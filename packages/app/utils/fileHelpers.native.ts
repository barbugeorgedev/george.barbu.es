import RNFS from "react-native-fs";

export const downloadFile = async (url: string, filename: string) => {
  const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
  await RNFS.downloadFile({ fromUrl: url, toFile: path }).promise;
  return `file://${path}`;
};

export const saveBase64File = async (base64data: string, filename: string) => {
  const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
  await RNFS.writeFile(path, base64data, "base64");
  return `file://${path}`;
};
