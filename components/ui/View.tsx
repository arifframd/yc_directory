import React from "react";
import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_QUERY_VIEWS } from "@/sanity/lib/query";
import { formatNumber } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";
import { auth } from "@/auth";

const View = async ({ id }: { id: string }) => {
  let { views: totalViews } = await client.withConfig({ useCdn: false }).fetch(STARTUP_QUERY_VIEWS, { id });
  if (totalViews <= 0) totalViews = 0; // Ensure views are not negative
  const session = await auth();
  console.log("session", session);

  // Update the number of views in the database
  try {
    after(async () => {
      await writeClient
        .withConfig({ useCdn: false })
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit();
    });
  } catch (e) {
    console.error("Failed to update views:", e);
  }

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="text-black">{formatNumber(totalViews)}</span>
      </p>
    </div>
  );
};

export default View;
