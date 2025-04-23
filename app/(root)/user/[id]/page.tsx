import { auth } from "@/auth";
import UserStartup from "@/components/ui/UserStartup";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/query";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/ui/StartupCard";

export const experimental_ppr = true; // untuk mengaktifkan pre-rendering pada page ini

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params; // mengambil id dari params
  const session = await auth();

  // ambil data user dari id
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) {
    return notFound();
  }

  return (
    <>
      <section className=" profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black text-center line-clamp-1 uppercase ">{user?.name}</h3>
          </div>

          <Image src={user?.image} alt={user?.name} width={220} height={220} className="profile_image" />
          <p className="text-30-extrabold mt-7 text-center">@{user?.username}</p>
          <p className="text-14-normal text-center- mt-1">{user?.bio}</p>
        </div>

        <div className=" flex-1 flex-col gap-5 lg:mt-5">
          <p className="text-30-bold ">{session?.id === id ? "Your" : "All"} Startups</p>
          <ul className="card_grid">
            {/* TODO: kasih semua startup yang dibuat user  */}
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartup id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default page;

// reminder:
// id dengan _id itu berbeda _id itu generate dari sanity ketika data dibuat,
