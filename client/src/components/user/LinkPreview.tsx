import { useApi } from "@/api/ApiContext";
import { CardHeader } from "@/components/ui/card";
import { ArrowUpRight, Ellipsis } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const S3LinkPreview = ({
  url,
  conversationId,
}: {
  url: string;
  conversationId: string;
}) => {
  const { schedulerApi } = useApi();
  const pattern = new RegExp("^s3://[^/]+/([a-f0-9-]+)_");
  const file_name = url.match(pattern)?.[1];
  const [loading, setLoading] = useState(false);
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

  const handleClick = async () => {
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

  return (
    <Button
      className="hover:cursor-pointer"
      variant="ghost"
      onClick={handleClick}
      disabled={loading}
    >
      <CardHeader>
        <div className="flex gap-2 justify-center items-center">
          <span>
            {loading
              ? "Fetching your report"
              : "Click here to download your report"}
          </span>
          {loading ? (
            <Ellipsis className="animate-pulse h-4 w-4" />
          ) : (
            <ArrowUpRight className="h-4 w-4" />
          )}
        </div>
      </CardHeader>
    </Button>
  );
};

export default S3LinkPreview;
