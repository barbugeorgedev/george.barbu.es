/** Matches blobPDF upload: george_barbu-{sanitySlug}-ats.pdf */
const PDF_BLOB_PREFIX = (
  process.env.NEXT_PUBLIC_PDF_BLOB_FILENAME_PREFIX || "george_barbu-"
).trim() || "george_barbu-";

export const pdfRoleFromSlug = (slug: string, isATS: boolean): string => {
  let key =
    slug === "/" || slug === ""
      ? "george.barbu"
      : slug.replace(/^\/+|\/+$/g, "");
  if (key.startsWith("_")) key = key.slice(1);
  if (!key) key = "george.barbu";
  return isATS ? `${key}-ats` : key;
};

export const getPdfDownloadFilename = (slug: string, isATS: boolean): string => {
  return `${PDF_BLOB_PREFIX}${pdfRoleFromSlug(slug, isATS)}.pdf`;
};

export const getPdfUrl = (slug: string, isATS: boolean = false) => {
  const SITE_URL =
    process.env.NODE_ENV !== "development"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3000";

  const apiSlug = pdfRoleFromSlug(slug, isATS === true);

  return `${SITE_URL}/api/pdf/${encodeURIComponent(apiSlug)}?role=${encodeURIComponent(apiSlug)}`;
};

export type FetchPdfResult = { blob: Blob; filename: string };

export const fetchPDFBlob = async (
  slug: string,
  isATS: boolean = false,
): Promise<FetchPdfResult | null> => {
  try {
    const response = await fetch(getPdfUrl(slug, isATS), {
      cache: "no-store",
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch PDF URL Error:", errorText);
      throw new Error(
        `Failed to fetch the latest PDF URL. Status: ${response.status}`,
      );
    }

    const data = (await response.json()) as {
      url?: string;
      filename?: string;
    };
    if (!data.url) throw new Error("No valid PDF URL found.");

    const pdfResponse = await fetch(data.url, { cache: "no-store" });
    if (!pdfResponse.ok) throw new Error("Failed to fetch the PDF file.");

    const blob = await pdfResponse.blob();
    const filename =
      (typeof data.filename === "string" && data.filename.endsWith(".pdf")
        ? data.filename
        : null) ?? getPdfDownloadFilename(slug, isATS);

    return { blob, filename };
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return null;
  }
};

export const downloadPDFweb = async (slug: string, isATS: boolean = false): Promise<void> => {
  const result = await fetchPDFBlob(slug, isATS);
  if (!result) return;

  const blobUrl = window.URL.createObjectURL(result.blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", result.filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

export const printPDF = async (slug: string, isATS: boolean = false): Promise<void> => {
  try {
    const result = await fetchPDFBlob(slug, isATS);
    if (!result) return;

    const blobUrl = URL.createObjectURL(result.blob);
    const iframe = document.createElement("iframe");

    // Set iframe styles to be invisible
    Object.assign(iframe.style, {
      position: "fixed",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0",
      zIndex: "-1",
      opacity: "0",
      pointerEvents: "none",
    });

    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (printError) {
          console.error("Error printing PDF:", printError);
        } finally {
          // Clean up after a short delay
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        }
      }, 500); // Ensure it fully loads before printing
    };
  } catch (error) {
    console.error("Error fetching/printing PDF:", error);
  }
};
