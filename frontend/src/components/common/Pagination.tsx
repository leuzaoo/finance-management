"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type Props = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
};

const currentPageStyle = "border-light/20 text-light/40 cursor-not-allowed";
const notCurrentPageStyle = "border-light/60 text-light hover:border-light/80";

export default function Pagination({
  totalPages,
  currentPage,
  goToPage,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 pt-4">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`cursor-pointer rounded border p-1 transition-all duration-200 hover:opacity-60 ${
          currentPage === 1 ? { currentPageStyle } : { notCurrentPageStyle }
        }`}
      >
        <ChevronLeftIcon size={20} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => goToPage(num)}
          className={`cursor-pointer rounded border px-3 py-1 transition-all duration-200 hover:opacity-60 ${
            num === currentPage
              ? "text-dark bg-white font-semibold"
              : { notCurrentPageStyle }
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`cursor-pointer rounded border p-1 transition-all duration-200 hover:opacity-60 ${
          currentPage === totalPages
            ? { currentPageStyle }
            : { notCurrentPageStyle }
        }`}
      >
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
}
