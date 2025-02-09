import * as FileSystem from "expo-file-system";

export const saveBase64File = async (base64data: string, filename: string) => {
  const fileUri = FileSystem.documentDirectory + filename;
  try {
    await FileSystem.writeAsStringAsync(fileUri, base64data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log(`File saved to: ${fileUri}`);
    return fileUri;
  } catch (error) {
    console.error("Error saving file:", error);
    return null;
  }
};

export const downloadFile = async (url: string, filename: string) => {
  const localUri = FileSystem.cacheDirectory + filename;
  try {
    const { uri } = await FileSystem.downloadAsync(url, localUri);
    console.log(`File downloaded to: ${uri}`);
    return uri;
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
  }
};
