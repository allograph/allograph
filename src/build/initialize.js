#!/usr/bin/env babel-node
var fs = require('fs-extra');
const program = require('commander'); 

program
  .command('setup')
  .description('Create allograph files')
  .action(function(req,optional){
    var pathname = process.cwd()

    fs.copy(__dirname + '/../allo_files', pathname, err => {
      if (err) return console.error(err)
        
      console.log('success!')
    })  
  });  

program.parse(process.argv);    