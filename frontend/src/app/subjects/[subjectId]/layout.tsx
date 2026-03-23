import Sidebar from "@/components/Sidebar";

export default function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subjectId: string };
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <main className="relative min-w-0 flex-1 overflow-y-auto bg-white">{children}</main>
      <Sidebar subjectId={params.subjectId} />
    </div>
  );
}
