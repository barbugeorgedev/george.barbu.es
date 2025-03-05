export const getPdfUrl = (slug: string) => {
  const SITE_URL =
    process.env.NODE_ENV !== "development"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:3000";

  // Construct URL with role query parameter
  return `${SITE_URL}/api/pdf/${slug}?role=${slug}`;
};

export const fetchPDFBlob = async (slug: string): Promise<Blob | null> => {
  try {
    // First, get the latest PDF URL from API
    const response = await fetch(getPdfUrl(slug));
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

export const downloadPDFweb = async (slug: string): Promise<void> => {
  const blob = await fetchPDFBlob(slug);
  if (!blob) return;

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;

  // Use `slug` in filename, ensuring it matches dynamically
  link.download = `${slug}.pdf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};

export const printPDF = async (slug: string): Promise<void> => {
  try {
    const blob = await fetchPDFBlob(slug);
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
