const express = require("express");
const { Snippet } = require("../models/snippet");
const router = express.Router();
const auth = require("../helpers/auth");

//find all snippets from a user
router.get("/", auth, async (req, res) => {
  //find all snippets that have user = to the current logged user
  const snippetsList = await Snippet.find({ user: req.user });
  // const snippetsList = await Snippet.find();

  if (!snippetsList) res.status(404).json({ success: false });
  res.status(200).send(snippetsList);
});

//sort user snippets by tag
router.get("/:tag", auth, async (req, res) => {
  const filteredSnippetList = await Snippet.find({
    tag: req.params.tag,
    user: req.user,
  });

  if (!filteredSnippetList) res.status(404).json({ success: false });
  res.status(200).send(filteredSnippetList);
});

//create snippet
router.post("/", auth, async (req, res) => {
  let snippet = new Snippet({
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    tag: req.body.tag,

    //add the user id to the snippet
    // user: "44",
    user: req.user,
  });
  // console.log(req.user);
  snippet = await snippet.save();

  if (!snippet) res.status(500).send("The snippet cannot be created!");
  res.send(snippet);
});

//update snippet
router.put("/:id", auth, async (req, res) => {
  const snippet = await Snippet.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      tag: req.body.tag,
    },
    { new: true } // get back the new data updated
  );
  if (!snippet) return res.status(404).send("the snippet cannot be updated!");
  res.send(snippet);
});

//delete snippet
router.delete("/:id", auth, (req, res) => {
  Snippet.findByIdAndDelete(req.params.id)
    .then((snippet) => {
      if (snippet) {
        return res
          .status(200)
          .json({ success: true, message: "The snippet is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "snippet not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
