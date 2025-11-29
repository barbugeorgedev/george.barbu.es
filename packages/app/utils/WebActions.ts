export const getPdfUrl = (slug: string, isATS: boolean = false) => {
  const SITE_URL =
    process.env.NODE_ENV !== "development"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3000";

  // Normalize slug: remove leading slash, use "george.barbu" for homepage
  const normalizedSlug = slug === "/" ? "george.barbu" : slug.replace(/^\//, "");
  
  // For ATS version, append -ats to the slug for the API
  // Explicitly check isATS to ensure we don't accidentally get ATS version
  const apiSlug = isATS === true ? `${normalizedSlug}-ats` : normalizedSlug;

  // Construct URL with role query parameter
  // The API route uses the slug in the path and role in query
  return `${SITE_URL}/api/pdf/${apiSlug}?role=${apiSlug}`;
};

export const fetchPDFBlob = async (slug: string, isATS: boolean = false): Promise<Blob | null> => {
  try {
    // First, get the latest PDF URL from API
    const response = await fetch(getPdfUrl(slug, isATS));
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fetch PDF URL Error:", errorText);
      throw new Error(
        `Failed to fetch the latest PDF URL. Status: ${response.status}`,
      );
    }

    const data = await response.json();
    if (!data.url) throw new Error("No valid PDF URL found.");

    // Now fetch the actual PDF
    const pdfResponse = await fetch(data.url);
    if (!pdfResponse.ok) throw new Error("Failed to fetch the PDF file.");

    return await pdfResponse.blob();
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return null;
  }
};

export const downloadPDFweb = async (slug: string, isATS: boolean = false): Promise<void> => {
  const blob = await fetchPDFBlob(slug, isATS);
  if (!blob) return;

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;

  const baseSlug = slug === "/" ? "george.barbu" : slug;
  const fileName = isATS ? `${baseSlug}-ats.pdf` : `${baseSlug}.pdf`;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

export const printPDF = async (slug: string, isATS: boolean = false): Promise<void> => {
  try {
    const blob = await fetchPDFBlob(slug, isATS);
    if (!blob) return;

    const blobUrl = URL.createObjectURL(blob);
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
