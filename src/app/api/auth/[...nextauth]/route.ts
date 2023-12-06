import { test } from "@/app/test/test";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "@neondatabase/serverless";

// export const runtime = "edge";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplie

        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        });

        const sql = `
        SELECT * FROM dba_account
        WHERE username = '${credentials?.username}' AND password = crypt('${credentials?.password}', password);
        `;
        
        const { rows } = await pool.query(sql);

        await pool.end();

        var user;

        if (rows.length > 0) {
          user = {
            id: "1",
            name: "Manager HospitalX",
            email: "manager.db231@gmail.com",
          };
        } else user = null;

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          console.log("1");
          return user;
        } else {
          console.log("0");
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signIn",
  },
});

export { handler as GET, handler as POST };
