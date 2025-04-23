import { client } from "@/sanity/lib/client";
import SearchForm from "@/components/ui/SearchForm";
import StartupCard, { StartupCardType } from "@/components/ui/StartupCard";
import { STARTUP_QUERY } from "@/sanity/lib/query";
import { auth } from "@/auth";
// import { SanityLive } from "@/sanity/lib/live";
// import { sanityFetch, SanityLive } from "@/sanity/lib/live";

export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const { query } = await searchParams;
  // const query = (await searchParams).query;  kenapa pake dalam kurung? karena itu adalah promise

  const session = await auth();
  console.log(session?.id);
  const params = { search: query || null }; // kenapa object? karena agar dapat dibaca oleh client.fetch ketika query

  // const { data: posts } = await sanityFetch({ query: STARTUP_QUERY, params });
  const posts = await client.fetch(STARTUP_QUERY, params); // disini query akan dibaca dengan $search, contoh title match $search

  // console.log(posts);
  // console.log(params);

  // Dummy Data
  // const posts = [
  //   {
  //     _createdAt: new Date(),
  //     views: 100,
  //     author: {
  //       name: "Arif",
  //       _id: 1,
  //     },
  //     _id: 1,
  //     description: "This is a description",
  //     image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     category: "Robots",
  //     title: "We Robots",
  //   },
  // ];

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Enterpreneurs
        </h1>
        <p className="sub-heading">Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.</p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">{query ? `Search result for "${query}"` : "All Startup"}</p>
        <ul className="card_grid mt-7">{posts?.length > 0 ? posts.map((post: StartupCardType) => <StartupCard key={post._id} post={post} />) : <p className="no-result">No Startup found</p>}</ul>
      </section>
      {/* <SanityLive /> */}
    </>
  );
}
