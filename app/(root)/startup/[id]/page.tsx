import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { PLAYLIST_WITH_SLUG_QUERY, STARTUP_QUERY_BY_ID } from "@/sanity/lib/query";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/ui/View";
import StartupCard, { StartupCardType } from "@/components/ui/StartupCard";

const md = markdownit(); // untuk mengkonversi markdown ke html

export const experimental_ppr = true; // untuk mengaktifkan pre-rendering pada page ini

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // menerapkan paralel data fetching
  const [post, { select: editorPicks }] = await Promise.all([client.fetch(STARTUP_QUERY_BY_ID, { id }), client.fetch(PLAYLIST_WITH_SLUG_QUERY, { slug: "editor-picks" })]);
  // const post = await client.fetch(STARTUP_QUERY_BY_ID, { id });
  if (!post) {
    notFound();
  }

  // fetching editor picks
  // const { select: editorPicks } = await client.fetch(PLAYLIST_WITH_SLUG_QUERY, { slug: "editor-picks" });

  const parsedContent = md.render(post.pitch) || "";
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img src={post.image} alt="thumbnail" className="w-full rounded-xl h-auto" />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link href={`/user/${post.author?._id}`} className="flex gap-2 mb-3 items-center">
              <Image src={post.author.image} alt="author-image" width={64} height={64} className="rounded-full drop-shadow-lg" />
              <div>
                <p className="text-20-medium"> {post.author.name}</p>
                <p className="text-16-medium !text-black-300"> @{post.author.username}</p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          <h3 className="text-30-bold">Pitch Details</h3>

          {/* dangerouslySetInnerHTML digunakan untuk menampilkan html yang sudah di parse dari markdown */}
          {parsedContent ? <article className=" prose max-w-4xl font-sans break-all" dangerouslySetInnerHTML={{ __html: parsedContent }} /> : <p className="no-result"> No Details</p>}
        </div>
        <hr className="divider" />

        {/* TODO: EDITOR SELECTOR STARTUPS */}

        {editorPicks.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>
            <ul className="mt-7 card_grid-sm">
              {editorPicks.map((post: StartupCardType) => (
                <StartupCard key={post._id} post={post} /> // TODO: ganti dengan StartupCard
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
