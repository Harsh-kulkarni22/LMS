import CourseCard, { type CourseCardSubject } from "./CourseCard";

interface CourseRowProps {
  title: string;
  subjects: CourseCardSubject[];
  /** Subject id → course progress % (0–100) from GET /api/progress/subjects/:id */
  progressBySubjectId?: Record<string, number>;
  /** Subject id → thumbnail url from first course video */
  thumbnailBySubjectId?: Record<string, string | null>;
  /** Show 0% progress rows (e.g. Continue learning) */
  alwaysShowProgress?: boolean;
}

export default function CourseRow({
  title,
  subjects,
  progressBySubjectId,
  thumbnailBySubjectId,
  alwaysShowProgress,
}: CourseRowProps) {
  if (subjects.length === 0) return null;

  return (
    <section className="mt-12 first:mt-8">
      <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {subjects.map((s) => (
          <CourseCard
            key={`${title}-${s.id}`}
            subject={s}
            courseProgressPercent={progressBySubjectId?.[s.id]}
            thumbnailUrl={thumbnailBySubjectId?.[s.id]}
            alwaysShowProgress={alwaysShowProgress}
          />
        ))}
      </div>
    </section>
  );
}
