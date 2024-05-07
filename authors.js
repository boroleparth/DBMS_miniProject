const res = require("express/lib/response");
const Author = require("../models/author");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();
//author
router.get("/", async (req, res) => {
  try {
    const searchOptions = {};
    const searchInput = req.query.search;

    if (mongoose.Types.ObjectId.isValid(searchInput)) {
      searchOptions._id = searchInput;
    } else {
      searchOptions.name = new RegExp(searchInput, "i");
    }

    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

//new author
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

router.post("/", async (req, res) => {
  const authorLength = await Author.find().countDocuments();
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`/authors`);
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error saving author",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/show", {
      author: author,
      uniqueId: author._id,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error updating Author",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    if (!author) {
      return res.render("authors/edit", {
        author: author,
        errorMessage: "Error updating Author",
      });
    }
    await Author.findByIdAndDelete(req.params.id);
    res.redirect("/authors");
  } catch {
    console.log(author.id);
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
