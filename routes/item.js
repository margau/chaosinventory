const express = require('express');
const router = express.Router();
// const passport = require('passport');

// Models
const Item = require('../models/item')

// Item details
router.get('/:itemId', (req, res) => {
  Item.findOne({_id: req.params.itemId}).populate('owner').then((doc) => {
    res.render('pages/item.ejs', {
      item: doc
    });
    console.log(doc);
  }).catch((error) => {
    res.status(404).send(error);
  });
});

module.exports = router;
