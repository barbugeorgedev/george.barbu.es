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
  const slug = pageData?.slug?.current ?? "/";

  const isWEB = Platform.OS === "web";
  
  // Detect if we're on an ATS page by checking the current pathname
  let isATS = false;
  let baseSlug = slug; // Default to slug from page data
  
  if (isWEB && typeof window !== "undefined") {
    const pathname = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
    const isATSv2 =
      pathname === "/ats-v2" || (pathname.length > 8 && pathname.endsWith("-ats-v2"));
    // /ats-v2 must not match -ats (pathname ...-ats-v2 also ends with -ats)
    isATS =
      !isATSv2 &&
      (pathname === "/ats" || (pathname.length > 4 && pathname.endsWith("-ats")));

    if (isATSv2) {
      baseSlug = pathname === "/ats-v2" ? "/" : pathname.replace(/-ats-v2$/, "") || "/";
    } else if (isATS) {
      if (pathname === "/ats") {
        baseSlug = "/";
      } else {
        const extracted = pathname.replace(/-ats$/, "");
        baseSlug = extracted === "" ? "/" : extracted;
      }
    }
  }

  const darkATSChrome = isATS;

  const downloadPDF = () => {
    if (isWEB) {
      // Ensure isATS is explicitly false for regular pages
      const shouldDownloadATS = isATS === true;
      return downloadPDFweb(baseSlug, shouldDownloadATS);
    }
    return downloadPDFmobile(slug);
  };

  return (
    <ViewWEB
      data-exclude="true"
      className="w-full flex flex-row items-center justify-center pt-6 sm:pb-2 lg:pb-5 print:invisible"
      style={{
        backgroundColor: darkATSChrome ? "#313638" : "transparent",
      }}
    >
      <TouchableOpacity onPress={downloadPDF} className="mr-2">
        <Icon
          type="fa"
          name="download"
          color={darkATSChrome ? "#525659" : settings?.headerIconsColor?.hex}
          className="!text-[28px] pb-1 sm:mb-0"
        />
      </TouchableOpacity>
      {isWEB ? (
        <TouchableOpacity onPress={() => printPDF(baseSlug, isATS)} className="ml-2">
          <Icon
            type="ai"
            name="AiFillPrinter"
            color={darkATSChrome ? "#525659" : settings?.headerIconsColor?.hex}
            size={30}
            className="!text-[28px] pb-1 sm:mb-0"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => sharePDFmobile(slug)} className="ml-2">
          <Icon
            name="share-alt"
            color={settings?.headerIconsColor?.hex}
            size={30}
            className="!text-[28px] pb-1 sm:mb-0"
          />
        </TouchableOpacity>
      )}
    </ViewWEB>
  );
};

export default Header;
