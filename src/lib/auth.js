import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from 'resend';



const resend = new Resend(process.env.RESEND_API_KEY);
const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db(process.env.BETTER_AUTH_DB_NAME);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },



emailVerification: {
 sendEmailVerficationEmail: async ({user, url})=>{
  void resend.emails.send({
    from:"Acme <onboarding@resend.dev>",
    to: user.email,
    subject:"verify your email address",
    html:`click <a href="${url}">here</a> to verify your email`
  })
 },
 sendOnSignUp: true,
 autoSignInAfterVerification: true,
 expiresIn: 3600 // 1 hour expires



},



  socialProviders : {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,

    }
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});