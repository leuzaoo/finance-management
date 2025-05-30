import { LoaderCircleIcon } from "lucide-react";

export const LoaderIcon = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
};
