import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import Icon from "ui/icon";
import { View as ViewWEB } from "ui/view";
import { downloadPDFweb, printPDF } from "app/utils/WebActions";
import { downloadPDFmobile, sharePDFmobile } from "app/utils/MobileActions";
import { useSettings } from "app/hooks/useSettings";
import { usePage } from "app/hooks/usePage";

const Header: React.FC = () => {
  const settings = useSettings();
  const pageData = usePage();
  const slug = pageData?.[0].slug.current ?? "/";

  const isWEB = Platform.OS === "web";
  const downloadPDF = () =>
    isWEB ? downloadPDFweb(slug) : downloadPDFmobile(slug);

  return (
    <ViewWEB
      data-exclude="true"
      className="max-w-screen-pdf relative flex flex-row mx-auto items-center justify-center text-center pt-6 sm:pb-2 lg:pb-5 print:invisible"
    >
      <TouchableOpacity onPress={downloadPDF} className="mr-2">
        <Icon
          type="fa"
          name="download"
          color={settings?.headerIconsColor}
          className="!text-[28px] pb-1 sm:mb-0"
        />
      </TouchableOpacity>
      {isWEB ? (
        <TouchableOpacity onPress={() => printPDF(slug)} className="ml-2">
          <Icon
            type="ai"
            name="AiFillPrinter"
            color={settings?.headerIconsColor}
            size={30}
            className="!text-[28px] pb-1 sm:mb-0"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => sharePDFmobile(slug)} className="ml-2">
          <Icon
            name="share-alt"
            color={settings?.headerIconsColor}
            size={30}
            className="!text-[28px] pb-1 sm:mb-0"
          />
        </TouchableOpacity>
      )}
    </ViewWEB>
  );
};

export default Header;
