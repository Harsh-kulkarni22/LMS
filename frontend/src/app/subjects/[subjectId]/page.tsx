/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { PlayCircle, Compass } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const [subject, setSubject] = useState<any>(null);
  const [tree, setTree] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const [subRes, treeRes] = await Promise.all([
          api.get(`/subjects/${params.subjectId}`),
          api.get(`/subjects/${params.subjectId}/tree`),
        ]);
        setSubject(subRes.data.data);
        setTree(treeRes.data.data);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [params.subjectId]);

  const handleStart = () => {
    if (!tree?.sections || tree.sections.length === 0) return;
    const firstSection = tree.sections[0];
    if (!firstSection.videos || firstSection.videos.length === 0) return;
    router.push(`/subjects/${params.subjectId}/video/${firstSection.videos[0].id}`);
  };

  if (!subject) return null;

  return (
    <div className="flex min-h-full items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-3xl rounded-lg border border-border-soft bg-white p-10 text-center shadow-sm transition-all duration-200 hover:shadow-md">
        <Compass className="mx-auto mb-6 h-14 w-14 text-accent" aria-hidden />
        <h1 className="text-3xl font-semibold text-gray-900">{subject.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
          {subject.description}
        </p>

        <button
          type="button"
          onClick={handleStart}
          className="mt-10 inline-flex items-center rounded bg-accent px-8 py-4 text-base font-semibold text-white transition hover:bg-accent-hover"
        >
          <PlayCircle className="mr-3 h-6 w-6" />
          Start learning
        </button>
      </div>
    </div>
  );
}
