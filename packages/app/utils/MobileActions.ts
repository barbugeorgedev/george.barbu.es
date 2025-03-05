import { Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import { isAndroid } from "app/utils/platformHelpers";

export const downloadPDFmobile = async (slug: string): Promise<void> => {
  console.log("downloadPDFmobile");
  if (slug) console.log("File ready at:", slug);
};

export const sharePDFmobile = async (slug: string): Promise<void> => {
  console.log("sharePDFmobile");
  try {
    if (!slug) return;

    if (isAndroid) {
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.SEND", {
          type: "application/pdf",
          extra: { "android.intent.extra.STREAM": slug },
        });
        console.log("PDF shared successfully on Android!");
      } catch (error) {
        console.error("Error sharing on Android:", error);
        Alert.alert("Error", "Failed to share PDF.");
      }
    } else if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(slug, {
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
