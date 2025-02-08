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

  const downloadPDFmobile = async (): Promise<void> => {
    try {
      // Fetch the file from the URL
      // Fetch the actual PDF file as a blob
      const response = await fetch(pdfUrl, { method: "GET" });

      if (!response.ok) {
        throw new Error("Failed to fetch the latest PDF.");
      }

      const blob = await response.blob();

      // Read the blob as a Base64 string
      const reader = new FileReader();
      reader.onload = async () => {
        const base64data = reader.result?.toString().split(",")[1]; // Extract the Base64 data without the header

        if (base64data) {
          // Write Base64 string to a file
          await FileSystem.writeAsStringAsync(localUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log("File downloaded to:", localUri);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file as Base64:", error);
      };

      reader.readAsDataURL(blob); // Convert the blob to a Base64-encoded string
    } catch (error) {
      console.error("Error during file download:", error);
    }
  };

  const sharePDFmobile = async (): Promise<void> => {
    try {
      // Define the local file path where the PDF will be saved
      const localFileUri = FileSystem.documentDirectory + pdfName; // You can use dynamic names based on the URL or timestamp

      // Fetch the PDF file from the URL
      const response = await fetch(pdfUrl, { method: "GET" });

      if (!response.ok) {
        throw new Error("Failed to fetch the latest PDF.");
      }

      // Fetch the PDF as a blob and save it to the file system
      const blob = await response.blob();

      // Write the blob content as a file to the local file system
      await FileSystem.writeAsStringAsync(localFileUri, await blob.text(), {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("File downloaded to:", localFileUri);

      // Now share the local file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(localFileUri); // Share the local file
        console.log("PDF shared successfully!");
      } else {
        Alert.alert(
          "Sharing is not available",
          "The current device cannot share files.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to download or share the document.");
      console.error("Error during sharing:", error);
    }
  };

  const downloadPDFweb = async (): Promise<void> => {
    try {
      // Fetch the actual PDF file as a blob
      const response = await fetch(pdfUrl, { method: "GET" });

      if (!response.ok) {
        throw new Error("Failed to fetch the latest PDF.");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const element = document.createElement("a");
      element.href = blobUrl;
      element.download = pdfName; // Change filename if needed

      // Trigger the download
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Revoke the object URL to free up memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
    }
  };

  const printPDF = (): void => {
    let resumePdfIframe = document.getElementById(
      "resumePdfIframe",
    ) as HTMLIFrameElement | null;

    if (!resumePdfIframe) {
      resumePdfIframe = document.createElement("iframe") as HTMLIFrameElement;
      resumePdfIframe.setAttribute("id", "resumePdfIframe");
      resumePdfIframe.setAttribute("name", "resumePdfIframe");
      resumePdfIframe.style.display = "none";
      document.body.appendChild(resumePdfIframe);
    }

    // Set the src attribute to the PDF URL
    resumePdfIframe.setAttribute("src", pdfUrl);

    // Ensure the iframe loads the PDF before attempting to print
    resumePdfIframe.onload = () => {
      if (resumePdfIframe.contentWindow) {
        resumePdfIframe.contentWindow.focus();
        resumePdfIframe.contentWindow.print();
      } else {
        console.error("Could not access iframe contentWindow");
      }

      // Remove the iframe after printing
      document.body.removeChild(resumePdfIframe);
    };
  };

  const downloadPDF = isWEB ? downloadPDFweb : downloadPDFmobile;

  return (
    <ViewWEB
      data-exclude="true"
      className="max-w-screen-pdf relative flex flex-row mx-auto items-center justify-center text-center pt-6 sm:pb-2 lg:pb-5 "
    >
      <TouchableOpacity onPress={downloadPDF} className="mr-2">
        <Icon
          type="fa"
          name="download"
          color="#313638"
          className="!text-[28px] pb-1 sm:mb-0"
        />
      </TouchableOpacity>

      {isWEB && (
        <TouchableOpacity onPress={printPDF} className="ml-2">
          <Icon
            type="ai"
            name="AiFillPrinter"
            color="#313638"
            size={30}
            className="!text-[28px] pb-1 sm:mb-0"
          />
        </TouchableOpacity>
      )}

      {!isWEB && (
        <TouchableOpacity onPress={sharePDFmobile} className="ml-2">
          <Icon
            name="share-alt"
            color="#313638"
            className="!text-[28px] pb-1 sm:mb-0"
          />
        </TouchableOpacity>
      )}
    </ViewWEB>
  );
};

export default Header;
