import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { pdfUrl } from "app/utils/WebActions";
import { downloadFile } from "app/utils/fileHelpers";
import { isAndroid } from "app/utils/platformHelpers";

export const downloadPDFmobile = async (): Promise<void> => {
  console.log("downloadPDFmobile");
  const uri = await downloadFile(pdfUrl, "george-barbu.pdf");
  if (uri) console.log("File ready at:", uri);
};

export const sharePDFmobile = async () => {
  console.log("sharePDFmobile");
  try {
    const uri = await downloadFile(pdfUrl, "shared.pdf");
    if (!uri) return;

    if (isAndroid) {
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.SEND", {
          type: "application/pdf",
          extra: { "android.intent.extra.STREAM": uri },
        });
        console.log("PDF shared successfully on Android!");
      } catch (error) {
        console.error("Error sharing on Android:", error);
        Alert.alert("Error", "Failed to share PDF.");
      }
    } else if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
        UTI: "com.adobe.pdf",
      });
      console.log("PDF shared successfully!");
    } else {
      Alert.alert("Sharing Not Available", "This device cannot share files.");
    }
  } catch (error) {
    Alert.alert("Error", "Failed to download or share the document.");
    console.error("Error during sharing:", error);
  }
};
