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

  return (
    <div className="flex items-center justify-center space-x-2 pt-4">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded border p-1 ${
          currentPage === 1
            ? "border-light/20 text-light/40 cursor-not-allowed"
            : "border-light/60 text-light hover:border-light/80"
        }`}
      >
        <ChevronLeftIcon size={20} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => goToPage(num)}
          className={`rounded border px-3 py-1 ${
            num === currentPage
              ? "text-dark bg-white font-semibold"
              : "border-light/60 text-light hover:border-light/80"
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded border p-1 ${
          currentPage === totalPages
            ? "border-light/20 text-light/40 cursor-not-allowed"
            : "border-light/60 text-light hover:border-light/80"
        }`}
      >
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
}
