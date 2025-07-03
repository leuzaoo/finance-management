"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type Props = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
};

const disabledStyle = "border-light/20 text-light/40 cursor-not-allowed";
const enabledStyle = "border-light/60 text-light hover:border-light/80";

export default function Pagination({
  totalPages,
  currentPage,
  goToPage,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-4">
      <div className="overflow-x-auto pb-1">
        <div className="font-zona-pro inline-flex items-center space-x-2 px-2 whitespace-nowrap">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`inline-block rounded border p-1 transition-all duration-200 hover:opacity-60 ${currentPage === 1 ? disabledStyle : enabledStyle} `}
          >
            <ChevronLeftIcon size={20} />
          </button>

          {pages.map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              disabled={num === currentPage}
              className={`inline-block min-w-[2.5rem] rounded border px-3 py-1 text-center transition-all duration-200 ${
                num === currentPage
                  ? "text-dark cursor-default bg-white font-semibold"
                  : enabledStyle
              } hover:opacity-80`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`inline-block rounded border p-1 transition-all duration-200 hover:opacity-60 ${currentPage === totalPages ? disabledStyle : enabledStyle} `}
          >
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
