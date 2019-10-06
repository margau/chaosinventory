#!/usr/bin/env node

require('dotenv').config()
// Mongoose modules
const mongoose = require('mongoose')
// Commander
const program = require('commander');
// prompt
const Prompt = require('prompt-password');

// Models
const User = require('./models/user')
const Item = require('./models/item')

// Initialize Database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// CLI itself
program.command('user <username>')
  .action((username) => {
    let prompt = new Prompt({
      type: 'password',
      message: 'Password for new user ' + username,
      name: 'password'
    });

    prompt.run()
      .then(function(password) {
        let newUser = new User({
          username: username,
          password: password
        });
        User.createUser(newUser, function(err) {
          if (err) throw err;
          console.log("User created");
          mongoose.connection.close();
        });
      });
  });

program.command('item <name>')
.option('-d, --description', 'description')
  .action((name, cmdObj) => {
    if(typeof cmdObj.description !== "string") {
      cmdObj.description = "";
    }
    let newItem = new Item({
      name: name,
      description: cmdObj.description,
      owner: process.env.DEFAULT_OWNER
    });
    newItem.save().then(() => {
      mongoose.connection.close();
    });
  });

program.command('')
program.parse(process.argv);
