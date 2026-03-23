import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 p-8 text-white shadow-md sm:p-10">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-2xl font-semibold sm:text-4xl">Learn without limits</h2>
          <p className="mt-3 text-base text-white/90 sm:text-lg">
            Build skills with expert-led video courses, track every lesson, and pick up exactly where
            you left off—on any device.
          </p>
          <Link
            href="/subjects"
            className="mt-6 inline-flex items-center justify-center rounded-lg border-2 border-white bg-white px-6 py-3 text-sm font-semibold text-purple-700 transition hover:bg-white/90"
          >
            Browse the catalog
          </Link>
        </div>
        <div
          className="relative h-44 w-full max-w-md shrink-0 overflow-hidden rounded-lg bg-white/10 shadow-inner backdrop-blur-sm md:h-52"
          aria-hidden
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-indigo-900/30" />
          <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M0 0h40v40H0V0zm40 40h40v40H40V40z\'/%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
      </div>
    </section>
  );
}
