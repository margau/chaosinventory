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

// Initialize Database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
	useCreateIndex: true
});

// CLI itself
program.command('create <username>')
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

program.parse(process.argv);
