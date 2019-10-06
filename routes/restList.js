const express = require('express');
const router = express.Router();

// Models
const Owner = require('../models/owner')
const Item = require('../models/item')

router.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send(401);
  }
});
// Owner
router.get('/owner', (req, res) => {
  Owner.find().then((docs) => {
    res.json(docs);
  }).catch((err) => {
    res.status(500).json({
      error: err
    });
    console.log(err);
  });
});
router.put('/owner', (req, res) => {
  let newOwner = new Owner(req.body);
  newOwner.save().then((docs) => {
    res.json(docs);
  }).catch((err) => {
    res.status(500).json({
      error: err
    });
    console.log(err);
  });
});

// Item
router.get('/item', (req, res) => {
  Item.find().populate('owner').then((docs) => {
    res.json(docs);
  }).catch((err) => {
    res.status(500).json({
      error: err
    });
    console.log(err);
  });
});

module.exports = router;
