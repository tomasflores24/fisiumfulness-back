const express = require('express');
const mongoose = require('mongoose');


const app = require("./src/app")

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
