import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { Database } from "./db/Database";

export const setupPassport = async () => {
    passport.serializeUser((user, done) => {
        /*
        From the user take just the id (to minimize the cookie size) and just pass the id of the user
        to the done callback
        */
        done(null, user);
    });

    passport.deserializeUser(async (userId: number, done) => {
        const user = await Database.profiles().getProfileById(userId);
        done(null, user || "error");
    });

    passport.use(new Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_COLBACK_URL
        },
        async (_accessToken, _refreshToken, profile, done) => {
            const userId = await Database.profiles().processOauth(profile.id, profile.displayName);
            return done(undefined, userId);
        }
    ));
}