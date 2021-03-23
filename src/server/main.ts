import * as dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import passport from "passport";
import { setupPassport } from "./PassportSetup";
import path from "path";
import { Database } from "./db/Database";
import { ProfileModel } from "./db/models/Profile";

const app = express();
const port = process.env.PORT || 8080;
const baseDir = path.resolve(path.join(__dirname + '../../../'))

// parse application/json
app.use(bodyParser.json());

app.use(cookieSession({
    name: 'translator-ts-session',
    keys: ['key1', 'key2']
}));

app.use("/dist", express.static(baseDir + '/dist'));
app.use("/assets", express.static(baseDir + '/assets'));


const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send('You are not authorized to view this page. Consider <a href="/login">login</a>')
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Entry point for client application
app.get('/', isLoggedIn, (_, res) => {
    const indexFile = path.join(baseDir, '/src/client/index.html')
    res.sendFile(indexFile);
});

app.get('/api/get-translations-info', isLoggedIn, async (_, res) => {
    const translationsInfo = await Database.translations().getTranslationsInfo();
    res.json(translationsInfo);
    res.end();
});

app.post('/api/suggest-translation', isLoggedIn, async (req, res) => {
    const result = await Database.translations().suggestNewTranslation(req.body, req.user as ProfileModel);
    res.json({"result": result});
    res.end();
});

// Entry page for authenticated user
app.get('/translations', isLoggedIn, (_req, res) => {
    const indexFile = path.join(baseDir, '/src/client/index.html')
    res.sendFile(indexFile);
})

// Auth Routes
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/failed', (_, res) => res.send('You are Failed to log in!'))

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    (_, res) => {
        // Successful authentication, redirect to the home page.
        res.redirect('/translations');
    }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

// start the express server
app.listen(port, async () => {

    const dbPath = path.resolve(__dirname, "..", "..", "..", "db/game.db");
    await Database.establishConnection("sqlite3://" + dbPath);

    // Add google auth credentials
    await setupPassport();

    console.log(`server started at http://localhost:${ port }`);
});
