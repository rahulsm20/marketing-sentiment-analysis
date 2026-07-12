import { useApi } from "@/api/ApiContext";
import { CardHeader } from "@/components/ui/card";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Eye,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
import { useConversation } from "@/hooks/useConversation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

// Set the worker source for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const S3LinkPreview = ({
  url,
  conversationId,
}: {
  url: string;
  conversationId: string;
}) => {
  const { schedulerApi } = useApi();
  const { refetch } = useConversation();
  const pattern = new RegExp("^s3://[^/]+/([a-f0-9-]+)_");
  const file_name = url.match(pattern)?.[1];
  const [loading, setLoading] = useState(false);
  const [s3Link, setS3Link] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // on click, fetch the report from the server
  function downloadFile(blob: Blob | MediaSource) {
    if (!blob || !file_name) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file_name;
    link.click();
    URL.revokeObjectURL(url);
  }

  const handleDownloadClick = async () => {
    if (!conversationId) return;

    setLoading(true);

    const data = await schedulerApi?.getReport(conversationId);
    if (!data?.url || !file_name) {
      setLoading(false);
      return;
    }

    const cache = await caches.open("report-cache");
    let response = await cache.match(data.url);

    if (!response) {
      response = await fetch(data.url);
      const cacheKey = `${conversationId}_${file_name}`;
      await cache.put(cacheKey, response.clone());
    }

    const blob = await response.blob();
    downloadFile(blob);

    setLoading(false);
  };

  const handleViewClick = async () => {
    console.log({ url, file_name, conversationId });
    if (!conversationId) return;

    setLoading(true);

    const data = await schedulerApi?.getReport(conversationId);

    if (!data?.url || !file_name) {
      setLoading(false);
      return;
    }

    const cache = await caches.open("report-cache");
    let response = await cache.match(data.url);

    if (!response) {
      response = await fetch(data.url);
      const cacheKey = `${conversationId}_${file_name}`;
      await cache.put(cacheKey, response.clone());
    }

    // const blob = await response.blob();
    // downloadFile(blob);
    setS3Link(data.url);
    setLoading(false);
  };

  const handleRegenerateClick = async () => {
    if (!conversationId) return;

    setLoading(true);

    const data = await schedulerApi?.generateReport(conversationId);
    if (!data || data.status != "ok") {
      setLoading(false);
      return;
    }

    setLoading(false);
    await refetch();
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex gap-2">
      <Button
        className="hover:cursor-pointer"
        variant="outline"
        onClick={handleDownloadClick}
        disabled={loading}
      >
        <div className="flex gap-2 justify-center items-center">
          <span>{loading ? "Fetching" : "Download"}</span>
          {loading ? (
            <Ellipsis className="animate-pulse h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </div>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="hover:cursor-pointer"
            variant="outline"
            onClick={handleViewClick}
            disabled={loading}
          >
            <CardHeader>
              <div className="flex gap-2 justify-center items-center">
                <span>{loading ? "Fetching" : "View"}</span>
                {loading ? (
                  <Ellipsis className="animate-pulse h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[50vw]">
          <DialogHeader>
            <DialogTitle>Report</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {s3Link && !loading ? (
              <div className="flex flex-col gap-2">
                <Document
                  className="max-h-[50vh] max-w-[50vw] overflow-y-auto"
                  file={s3Link}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
                <div className="flex gap-2 justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === 1 || loading}
                    onClick={() => setPageNumber((prev) => prev - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <Button
                    variant="outline"
                    disabled={pageNumber === numPages || loading}
                    size="sm"
                    onClick={() => setPageNumber((prev) => prev + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center">
                <Ellipsis className="animate-pulse h-4 w-4" />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                File not found
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Button
        className="hover:cursor-pointer flex gap-2"
        variant="outline"
        onClick={handleRegenerateClick}
        disabled={loading}
      >
        <span className="flex items-center gap-2">
          {loading ? "Fetching" : "Regenerate"}
        </span>
        {loading ? (
          <Ellipsis className="animate-pulse h-4 w-4" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default S3LinkPreview;
