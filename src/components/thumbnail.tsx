/* eslint-disable-next-line @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { XIcon } from "lucide-react";

interface Props {
  url: string | null | undefined;
}

export const Thumbnail = ({ url }: Props) => {
  if (!url) return null;

  return (
    <div className="relative overflow-hidden max-w-90 border rounded-lg my-2 cursor-zoom-in">
      <img
        src={url}
        alt="Message Image"
        className="rounded-md object-cover size-full"
      />
    </div>
  );
};
