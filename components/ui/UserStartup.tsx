import { client } from "@/sanity/lib/client";
import { STARTUP_QUERY_BY_AUTHOR } from "@/sanity/lib/query";
import React from "react";
import StartupCard, { StartupCardType } from "./StartupCard";

const UserStartup = async ({ id }: { id: string }) => {
  const startups = await client.fetch(STARTUP_QUERY_BY_AUTHOR, { id });

  return <>{startups.length > 0 ? startups.map((startup: StartupCardType) => <StartupCard key={startup._id} post={startup} />) : <p className="no-result">No Startup found</p>}</>;
};

export default UserStartup;
