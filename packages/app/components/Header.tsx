import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import Icon from "ui/icon";
import { View as ViewWEB } from "ui/view";
import { downloadPDFweb, printPDF } from "app/utils/WebActions";
import { downloadPDFmobile, sharePDFmobile } from "app/utils/MobileActions";
import { useSettings } from "app/hooks/useSettings";
import { usePage } from "app/hooks/usePage";
import { parseAtsPathname } from "app/utils/atsRoutes";

const Header: React.FC = () => {
  const settings = useSettings();
  const pageData = usePage();
  const slug = pageData?.slug?.current ?? "/";

  const isWEB = Platform.OS === "web";
  
  let isATS = false;
  let baseSlug = slug;

  if (isWEB && typeof window !== "undefined") {
    const pathname = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
    const { mode, baseSlug: atsBase } = parseAtsPathname(pathname);
    isATS = mode !== "none";
    if (isATS) {
      baseSlug = atsBase;
    }
  }

  const lightAtsPage = isATS;

  /** Vercel blobs are named from Sanity slug (blobPDF.js), not the synthetic "/" → george.barbu key. */
  const cmsSlug = pageData?.slug?.current;
  const pdfSlug =
    baseSlug === "/" && cmsSlug && cmsSlug !== "/" ? cmsSlug : baseSlug;

  const downloadPDF = () => {
    if (isWEB) {
      // Ensure isATS is explicitly false for regular pages
      const shouldDownloadATS = isATS;
      return downloadPDFweb(pdfSlug, shouldDownloadATS);
    }
    return downloadPDFmobile(slug);
  };

  return (
    <ViewWEB
      data-exclude="true"
      className="w-full flex flex-row items-center justify-center pt-6 sm:pb-2 lg:pb-5 print:invisible"
      style={{
        backgroundColor: "transparent",
      }}
    >
      <TouchableOpacity onPress={downloadPDF} className="mr-2">
        <Icon
          type="fa"
          name="download"
          color={lightAtsPage ? "#171717" : settings?.headerIconsColor?.hex}
          className="!text-[28px] pb-1 sm:mb-0"
        />
      </TouchableOpacity>
      {isWEB ? (
        <TouchableOpacity onPress={() => printPDF(pdfSlug, isATS)} className="ml-2">
          <Icon
            type="ai"
            name="AiFillPrinter"
            color={lightAtsPage ? "#171717" : settings?.headerIconsColor?.hex}
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
