"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createStartup = async (state: any, form: FormData, pitch: string) => {
  const session = await auth();
  if (!session) {
    return parseServerActionResponse({ error: "Unauthorized", status: "ERROR", field: { title: "", description: "", category: "", link: "" } });
  }

  // ambil semua data dari form
  const { title, description, category, link } = Object.fromEntries(Array.from(form).filter(([key]) => key !== "pitch")); // ambil semua data dari form kecuali pitch

  // ambil data dari form bisa seperti ini juga, jika form: {title: string, description: string, category: string, link: string}
  // const {title, description, category, link} = form

  // slug
  const slug = slugify(title as string, { lower: true, strict: true }); // buat slug dari title

  // masukan data ke dalam database
  try {
    const newStartup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session.id,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...newStartup }); // create startup baru di database

    return parseServerActionResponse({ ...result, error: "", status: "SUCCESS", field: { title: "", description: "", category: "", link: "" } }); // kembalikan hasil dari create
  } catch (error) {
    return parseServerActionResponse({ error: JSON.stringify(error), status: "ERROR", field: { title, description, category, link } });
  }
};
