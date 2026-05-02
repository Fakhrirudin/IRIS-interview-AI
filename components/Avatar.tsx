import Image from "next/image";

export default function Avatar({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative"
    >
      <Image
        src="/iris/iris-avatar.png"
        alt="IRIS AI"
        fill
        className="rounded-full object-cover border border-gray-700"
      />
    </div>
  );
}