const STORAGE_KEY = "lms:subjectActivity";

export type SubjectActivity = {
  subjectId: string;
  lastAt: number;
};

function readAll(): SubjectActivity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SubjectActivity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: SubjectActivity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Call when the user watches a lesson in a subject (any progress). */
export function recordSubjectActivity(subjectId: string) {
  const now = Date.now();
  const list = readAll().filter((e) => e.subjectId !== subjectId);
  list.unshift({ subjectId, lastAt: now });
  writeAll(list.slice(0, 50));
}

/** Sort subjects: most recently active first, then rest alphabetically by id. */
export function sortSubjectsByRecentActivity<T extends { id: string }>(subjects: T[]): T[] {
  const list = readAll();
  const rank = new Map(list.map((e, i) => [e.subjectId, i]));
  return [...subjects].sort((a, b) => {
    const ra = rank.has(a.id) ? rank.get(a.id)! : 999;
    const rb = rank.has(b.id) ? rank.get(b.id)! : 999;
    if (ra !== rb) return ra - rb;
    return a.id.localeCompare(b.id);
  });
}

export function hasRecordedActivity(subjectId: string): boolean {
  return readAll().some((e) => e.subjectId === subjectId);
}
