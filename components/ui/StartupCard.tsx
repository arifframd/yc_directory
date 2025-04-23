import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { Author, Startup } from "@/sanity.types";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Skeleton } from "./skeleton";

export type StartupCardType = Omit<Startup, "author"> & { author?: Author }; // menghilangkan author dari Startup dan menambah author dengan type Author dan "&" berarti menggabungkan type

const StartupCard = ({ post }: { post: StartupCardType }) => {
  // destructuring semua yang ada di post
  const { _createdAt, views, author, _id, title, category, description, image } = post;

  return (
    <>
      <li className="startup-card group">
        <div className=" flex-between">
          <p className="startup-card_date">{formatDate(_createdAt)}</p>
          <div className="flex gap-1.5">
            <EyeIcon className="size-6 text-primary" />
            <span className="text-16-medium">{views}</span>
          </div>
        </div>

        <div className="flex-between mt-5 gap-5">
          <div className="flex-1">
            <Link href={`/user/${author?._id}`}>
              <p className="text-16-medium line-clamp-1">{author?.name}</p>
            </Link>
            <Link href={`/startup/${_id}`}>
              <h3 className="text-26-semibold line-clamp-1">{title}</h3>
            </Link>
          </div>
          <Link href={`/user/${author?._id}`}>
            <Image src={author?.image || "https://placehold.co/48x48"} alt={author?.name || "profile-picture"} width={48} height={48} className="rounded-full" />
          </Link>
        </div>

        <Link href={`/startup/${_id}`}>
          <p className="startup-card_desc">{description}</p>
          <img src={image} alt="image" className="startup-card_img" />
        </Link>

        <div className="flex-between gap-3 mt-5">
          <Link href={`/?query=${category?.toLowerCase()}`}>
            <p className="text-16-medium">{category}</p>
          </Link>
          <Link href={`/startup/${_id}`}>
            <Button className="startup-card_btn">Detail</Button>
          </Link>
        </div>
      </li>
    </>
  );
};

// StartupCardSkeleton digunakan untuk menampilkan skeleton loading ketika data startup belum ada
export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4, 5].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
