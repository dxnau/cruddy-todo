const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, uniqueId)=>{

    var fileName = exports.dataDir + '/' + uniqueId + '.txt';

    fs.writeFile(fileName, text, (err) => {
      if (err) {
        console.log(err);
      } else {
        //TODO: understand why this is an obj
        callback(null, { id: uniqueId, text });
      }
    })

  });
};

exports.readAll = (callback) => {
  var fileArr = [];
  fs.readdir(exports.dataDir, (err, files)=>{
    if (err) {
      console.log(err)
    } else {
      if (files.length === 0) {
        callback(err, []);
      }
      files.forEach(file => {
        var fileId = file.slice(0, -4)
        // console.log(fileId)
        var filObj = {};
        filObj.id = fileId;
        filObj.text = fileId;
        // console.log(filObj)
        fileArr.push(filObj);
      });
    }
    // console.log(fileArr);
    callback(null, fileArr);
  })
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
