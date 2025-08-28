"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type Props = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  goToPage,
}: Props) {
  if (totalPages <= 1) return null;

  const windowed = () => {
    const pages: (number | "...")[] = [];
    const push = (x: number | "...") =>
      pages.length === 0 || pages[pages.length - 1] !== x
        ? pages.push(x)
        : null;

    const addRange = (s: number, e: number) => {
      for (let i = s; i <= e; i++) push(i);
    };

    const left = Math.max(1, currentPage - 1);
    const right = Math.min(totalPages, currentPage + 1);

    push(1);
    if (left > 2) push("...");
    addRange(left, right);
    if (right < totalPages - 1) push("...");
    if (totalPages > 1) push(totalPages);
    return pages;
  };

  const pages = windowed();

  const baseBtn =
    "inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500";
  const enabled =
    "border-black/15 text-black hover:bg-black/5 dark:border-white/15 dark:text-white/90 dark:hover:bg-white/10";
  const disabled =
    "cursor-not-allowed border-black/10 text-black/30 dark:border-white/10 dark:text-white/30";

  return (
    <nav className="mt-3 flex items-center justify-center">
      <div className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/5">
        <button
          onClick={() => goToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`${baseBtn} ${currentPage === 1 ? disabled : enabled}`}
          aria-label="Página anterior"
        >
          <ChevronLeftIcon size={18} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`d-${i}`} className="px-2 text-sm opacity-60">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              disabled={p === currentPage}
              className={`${baseBtn} ${
                p === currentPage
                  ? "cursor-default border-blue-500 bg-blue-600 text-white hover:bg-blue-600"
                  : enabled
              } min-w-[2.5rem]`}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`${baseBtn} ${currentPage === totalPages ? disabled : enabled}`}
          aria-label="Próxima página"
        >
          <ChevronRightIcon size={18} />
        </button>
      </div>
    </nav>
  );
}
