import { defineField, defineType } from "sanity";

export const playlist = defineType({
  name: "playlist",
  title: "Playlist",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "select",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "startup" },
        },
      ],
    }),
  ],
});

// ini adalah schema untuk playlist yang berisi array of reference ke startup
