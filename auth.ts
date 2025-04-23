import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/query";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // callbacks ini adalah fungsi yang dipanggil oleh NextAuth.js pada saat proses otentikasi

    // callback signIn dipanggil pada saat user melakukan sign in
    async signIn({ user, profile }) {
      const { name, email, image } = user;

      // mengecek apakah user sudah terdaftar di database atau belum
      const existingUser = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
        id: profile?.id,
      });

      // jika user belum terdaftar, maka buat user baru di database
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile?.id,
          name,
          username: profile?.login,
          email,
          image,
          bio: profile?.bio || "",
        });
      }

      return true;
    },

    // callback jwt dipanggil pada saat token JWT dibuat
    // fungsi callback jwt ini digunakan untuk menambahkan informasi user ke dalam token JWT
    async jwt({ token, profile, account }) {
      if (account && profile) {
        const user = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile?.id,
        });
        token.id = user?._id;
      }
      return token;
    },

    // callback session dipanggil pada saat session dibuat
    // fungsi callback session ini digunakan untuk menambahkan informasi user ke dalam session
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
