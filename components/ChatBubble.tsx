import Avatar from "./Avatar";

export default function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      
      {!isUser && (
        <div className="mr-2">
          <Avatar size={32} />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] ${
          isUser
            ? "bg-white text-black"
            : "bg-gray-800 border border-gray-700"
        }`}
      >
        {!isUser && (
          <p className="text-xs text-gray-400 mb-1">IRIS</p>
        )}
        {content}
      </div>
    </div>
  );
}