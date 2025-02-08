import React from "react";
import { Platform, Alert, TouchableOpacity } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import Icon from "ui/icon";
import { View as ViewWEB } from "ui/view";

const Header: React.FC = () => {
  const isWEB = Platform.OS === "web";
  const pdfName = "george-barbu.pdf";
  const pdfUrl = "/api/download-pdf";
  const localUri = FileSystem.documentDirectory + pdfName;

  const fetchPDFBlob = async (): Promise<Blob | null> => {
    try {
      const response = await fetch(pdfUrl, { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch the latest PDF.");
      return await response.blob();
    } catch (error) {
      console.error("Error fetching PDF:", error);
      return null;
    }
  };

  const downloadPDFmobile = async (): Promise<void> => {
    const blob = await fetchPDFBlob();
    if (!blob) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64data = reader.result?.toString().split(",")[1];
      if (base64data) {
        await FileSystem.writeAsStringAsync(localUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log("File downloaded to:", localUri);
      }
    };
    reader.readAsDataURL(blob);
  };

  const sharePDFmobile = async (): Promise<void> => {
    const blob = await fetchPDFBlob();
    if (!blob) return;

    await FileSystem.writeAsStringAsync(localUri, await blob.text(), {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("File downloaded to:", localUri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri);
    } else {
      Alert.alert(
        "Sharing is not available",
        "The current device cannot share files.",
      );
    }
  };

  const downloadPDFweb = async (): Promise<void> => {
    const blob = await fetchPDFBlob();
    if (!blob) return;

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = pdfName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  const printPDF = (): void => {
    let iframe = document.getElementById(
      "resumePdfIframe",
    ) as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "resumePdfIframe";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }

    iframe.src = pdfUrl;
    iframe.onload = () => {
      try {
        iframe?.contentWindow?.focus();
        setTimeout(() => {
          try {
            iframe?.contentWindow?.print();
          } finally {
            document.body.removeChild(iframe as Node);
          }
        }, 500);
      } catch (error) {
        console.error("Error printing PDF:", error);
        document.body.removeChild(iframe);
      }
    };
  };

  const downloadPDF = isWEB ? downloadPDFweb : downloadPDFmobile;

  return (
    <ViewWEB className="max-w-screen-pdf relative flex flex-row mx-auto items-center justify-center text-center pt-6 sm:pb-2 lg:pb-5">
      <TouchableOpacity onPress={downloadPDF} className="mr-2">
        <Icon
          type="fa"
          name="download"
          color="#313638"
          className="!text-[28px] pb-1 sm:mb-0"
        />
      </TouchableOpacity>
      {isWEB ? (
        <TouchableOpacity onPress={printPDF} className="ml-2">
          <Icon
            type="ai"
            name="AiFillPrinter"
            color="#313638"
            size={30}
            className="!text-[28px] pb-1 sm:mb-0"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={sharePDFmobile} className="ml-2">
          <Icon
            name="share-alt"
            color="#313638"
            size={30}
            className="!text-[28px] pb-1 sm:mb-0"
          />
        </TouchableOpacity>
      )}
    </ViewWEB>
  );
};

export default Header;
