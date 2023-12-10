import express from "express";
import TV from "./models/TV.js";

const app = express();
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

app.get("/", async (req, res) => {
    const wishList = await TV.loadMany({ bought: 0 });
    const boughtList = await TV.loadMany({ bought: 1 });
    const balance = boughtList.reduce((acc, tv) => acc + tv.price, 0);
    res.render("wishlist.ejs", { wishList: wishList, boughtList: boughtList, balance: balance });
});

app.post("/add", async (req, res) => {
    const tv = new TV();
    tv.brand = req.body.brand;
    tv.size = req.body.size;
    tv.price = req.body.price;
    tv.bought = 0;
    await tv.save();
    res.redirect("/");
});

app.get("/buy/:id", async (req, res) => {
    const tv = await TV.load({ id: req.params.id });
    tv.bought = 1;
    await tv.save();
    res.redirect("/");
});

app.listen(port, function () {
    console.log(`Server is running on port ${port} ...`);
});
