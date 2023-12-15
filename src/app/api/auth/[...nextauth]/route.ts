import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "@neondatabase/serverless";

// export const runtime = "edge";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password",  placeholder: "password"},
      },
      async authorize(credentials, req) {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        }); // connect to db

        const sql = `
        SELECT * FROM dba_account
        WHERE username = '${credentials?.username}' 
        AND password = crypt('${credentials?.password}', password);
        `;

        // const sql = `
        // SELECT * FROM dba_account
        // WHERE (username = '${credentials?.username}')
        // AND (password = '${credentials?.password}');
        // `;

        // console.log(sql)
        
        const { rows } = await pool.query(sql); // run sql

        await pool.end();
        var user;
        if (rows.length > 0) {
          user = {
            name: rows[0].username,
          };
        } else user = null;
        if (user) return user; else return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signIn",
  },
});

export { handler as GET, handler as POST };
