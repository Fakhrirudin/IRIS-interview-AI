import "./globals.css";

export const metadata = {
  title: "IRIS Interview AI",
  description: "Practice interviews with an AI recruiter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] text-white">{children}</body>
    </html>
  );
}