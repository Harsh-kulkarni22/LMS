import { Lock, FileText } from "lucide-react";

interface Props {
  title: string;
  description: string | null;
  locked: boolean;
  unlockReason: string | null;
}

export default function VideoMeta({ title, description, locked, unlockReason }: Props) {
  return (
    <div className="mt-6 rounded-lg border border-border-soft bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {locked ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Lock className="mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">Content locked</h2>
          <p className="max-w-md text-gray-600">
            {unlockReason || "You must complete previous content to unlock this video."}
          </p>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{title}</h1>
          <div className="mt-6 flex items-start gap-4">
            <FileText className="mt-1 h-6 w-6 shrink-0 text-purple-600" aria-hidden />
            <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
              {description || "No description provided."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
