import { useReactToPrint } from "react-to-print";

export const usePrintCv = (contentRef) => {
  const triggerPrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `CV ATS - Fabianus Kevin`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0mm !important; /* Paksa margin halaman jadi 0 */
      }
      
      @media print {
        html, body {
          width: 210mm;
          height: 297mm;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
        }
      }
    `,
    onAfterPrint: () => console.log("Print success"),
  });
  return triggerPrint;
};
