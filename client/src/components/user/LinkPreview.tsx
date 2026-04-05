import { useApi } from "@/api/ApiContext";
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

const S3LinkPreview = ({
  url,
  conversationId,
}: {
  url: string;
  conversationId: string;
}) => {
  const schedulerApi = useApi();
  const pattern = new RegExp("^s3://[^/]+/([a-f0-9-]+)_");
  const file_name = url.match(pattern)?.[1];
  //   const [id, setId] = useState<string>();
  console.log({ conversationId });
  // on click, fetch the report from the server
  const handleClick = () => {
    schedulerApi.getReport(conversationId).then((data) => {
      if (!data || !data.url || !file_name) return;
      console.log(data.url);
      const url = URL.createObjectURL(data.url);
      const link = document.createElement("a");
      console.log({ link, url, file_name });
      link.href = url;
      link.download = file_name;
      link.click();
    });
  };
  return (
    <Card className="hover:cursor-pointer" onClick={() => handleClick()}>
      <CardHeader>
        <div className="flex gap-2">
          <span>Click here to download your report</span>
          <ArrowUpRight />
        </div>
      </CardHeader>
    </Card>
  );
};

export default S3LinkPreview;
