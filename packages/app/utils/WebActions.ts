export const pdfName = "george-barbu.pdf";
const SITE_URL =
  process.env.NODE_ENV !== "development"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:3000";
export const getPdfUrl = (slug: string) => `${SITE_URL}/api/pdf/${slug}`;

export const fetchPDFBlob = async (slug: string): Promise<Blob | null> => {
  try {
    const response = await fetch(getPdfUrl(slug), { method: "GET" });
    if (!response.ok) throw new Error("Failed to fetch the latest PDF.");
    return await response.blob();
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
  link.download = `george-barbu-${slug}.pdf`;
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

    Object.assign(iframe.style, { display: "none" });
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 500);
    };
  } catch (error) {
    console.error("Error fetching/printing PDF:", error);
  }
};
