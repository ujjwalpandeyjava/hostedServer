const express = require("express");
const router = express.Router();

//  Fetch all data
router.get("/", (req, res) => {
    res.status(200).json({ "data": "data..." })
});

//  Insert data
router.post('/', (req, res) => {
    return res.status(201).json({ status: "Saved successfully" })
})

//  Delete Contact
router.delete('/:id', (req, res) => {
    return res.status(201).json({ status: "Saved successfully" });
})

//  Fetch Contact by id
router.get('/:id', (req, res) => {
    console.log("Fetch by id: ", req.params);
})

//  Update Contact
router.put('/:id', (req, res) => {
    return res.status(200).send("please fill all the fields")
})

module.exports = router