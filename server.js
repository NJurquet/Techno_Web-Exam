import express from "express";
import TV from "./models/TV.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const port = process.env.PORT || 80;

app.get("/", async (req, res) => {
    const wishList = await TV.loadMany({ bought: 0 });
    res.render("wishlist.ejs", { wishList: wishList });
});

app.post("/add", async (req, res) => {
    const tv = new TV();
    // tv.brand = req.body.brand;
    // tv.size = req.body.size;
    // tv.price = req.body.price;
    // tv.bought = 0;
    tv.update({ brand: req.body.brand, size: req.body.size, price: req.body.price, bought: 0 });
    await tv.save();
    const newTV = await TV.load({ id: req.params.id });
    res.redirect("/");
});

app.listen(port, function () {
    console.log(`Server is running on port ${port} ...`);
});
