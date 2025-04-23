import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id: string;
  }
  interface JWT {
    id: string;
  }
}

// file ini digunakan untuk menambahkan id ke dalam session dan jwt pada next-auth
