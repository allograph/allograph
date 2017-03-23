var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var exampleQuery = `
{
  users{
    firstName,
    lastName,
    posts {
      title
    },
    comments {
      content
    }
  }
}`;

var exampleMutation = `
mutation {
  addUser(
    firstName: "Graph",
    lastName: "QL",
    email: "graphql@example.com"
  ) {
    id,
    firstName,
    lastName,
    email
  }
}`

post(exampleMutation).then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
});

get(exampleQuery).then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.error("Failed!", error);
});

function get(query) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', "http://localhost:3000/graphql?query=" + query);
    req.setRequestHeader("Content-Type", "application/graphql");

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.responseText);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send(JSON.stringify({
      query: query,
    }));
  });
}

function post(mutaion) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('POST', "http://localhost:3000/graphql");
    req.setRequestHeader("Content-Type", "application/json");

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.responseText);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send(JSON.stringify({
      query: mutaion,
    }));
  });
}