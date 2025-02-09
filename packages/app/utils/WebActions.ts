export const pdfName = "george-barbu.pdf";
export const pdfUrl = "https://george.barbu.es/api/download-pdf";

export const fetchPDFBlob = async (): Promise<Blob | null> => {
  try {
    const response = await fetch(pdfUrl, { method: "GET" });
    if (!response.ok) throw new Error("Failed to fetch the latest PDF.");
    return await response.blob();
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return null;
  }
};

export const downloadPDFweb = async (): Promise<void> => {
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

export const printPDF = async (): Promise<void> => {
  try {
    const response = await fetch(pdfUrl);
    const blob = await response.blob();
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
