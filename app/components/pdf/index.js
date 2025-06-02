"use client";
import dynamic from "next/dynamic";

export { ReceiptPage } from "./documents/document";

export const PDFViewer = dynamic(
  async () => await import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false, loading: () => <>Loading...</> }
);

export const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  }
);
