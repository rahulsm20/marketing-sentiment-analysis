import { MessageType } from "@/types";
import { getAllS3LinksFromText } from "@/utils";
import S3LinkPreview from "./LinkPreview";

//-----------------------------------------------------------------------------------

const ChatMessage = ({ message }: { message: MessageType }) => {
  const s3Links = getAllS3LinksFromText(message.content);
  const cleanedContent = s3Links.reduce((acc, link) => {
    return acc.replace(link, "");
  }, message.content);
  const conversationId = message.conversationId;
  return (
    <div
      className={`flex justify-${message.role === "user" ? "end" : "start"}`}
    >
      <div
        className={`p-4 border rounded-[var(--radius)] w-fit flex flex-col gap-5`}
      >
        <p>{cleanedContent}</p>
        {s3Links.length > 0 && (
          <div className="flex gap-2 items-center">
            {s3Links.map((link) => (
              <S3LinkPreview url={link} conversationId={conversationId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
