import express from "express";
import Vocab from "./models/Vocab.js";
import session from "express-session";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: true,
    })
);

const port = process.env.PORT || 80;

let feedback = "";

app.get("/", async (req, res) => {
    const allWords = await Vocab.loadMany();
    const random = Math.floor(Math.random() * allWords.length);
    const word = allWords[random];
    req.session.word = word;
    res.render("mainPage.ejs", { word: word, feedback: feedback });
});

app.get("/vocabulary", async (req, res) => {
    const words = await Vocab.loadMany();
    res.render("vocabulary.ejs", { words: words });
});

app.post("/test", async (req, res) => {
    const wordSession = req.session.word;
    const wordVocab = await Vocab.load({ id: wordSession.id });
    wordVocab.update({ tries: wordVocab.tries++ });
    if (req.body.translation == wordSession.translation) {
        wordVocab.update({ correct: wordVocab.correct++ });
        feedback = `Unfortunately, ${wordSession.text} is ${wordSession.translation}`;
    }
    res.redirect("/");
});

app.post("/add", async (req, res) => {
    const newVocab = new Vocab();
    newVocab.update({ text: req.body.word, translation: req.body.translation, tries: 0, correct: 0 });
    await newVocab.save();
    res.redirect("/vocabulary");
});

app.get("/remove/:id", async (req, res) => {
    await Vocab.delete({ id: req.params.id });
    res.redirect("/vocabulary");
});

app.listen(port, function () {
    console.log(`Server is running on port ${port} ...`);
});
