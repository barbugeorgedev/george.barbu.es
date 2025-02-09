import React from "react";
import { Platform, Alert, TouchableOpacity } from "react-native";
import Icon from "ui/icon";
import { View as ViewWEB } from "ui/view";
import { downloadPDFweb, printPDF } from "app/utils/WebActions";
import { downloadPDFmobile, sharePDFmobile } from "app/utils/MobileActions";

const Header: React.FC = () => {
  const isWEB = Platform.OS === "web";
  const downloadPDF = isWEB ? downloadPDFweb : downloadPDFmobile;

  return (
    <ViewWEB
      data-exclude="true"
      className="max-w-screen-pdf relative flex flex-row mx-auto items-center justify-center text-center pt-6 sm:pb-2 lg:pb-5 print:hidden"
    >
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
