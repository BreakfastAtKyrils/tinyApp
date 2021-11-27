const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

function generateRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = '';
  for (let x = 0; x < 6; x++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//this function shows the json object when we navigate to /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//this function renders the urls_new template when we navigate to the link
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//this function create a constant with our urlDatabase object and renders it using
//the urls_index template
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//this functions is called whenever a user navigates to urls/[any]
//it takes the string after the / and creates an object with
// key: shortURL value: shortURL
// key: longURL: value: urlDatabase.shortURL
//and passes that object into the res.render function
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = req.body.longURL

  console.log('longurl is: '+ urlDatabase[shortURL])

  const templateVars = { shortURL: shortURL , longURL: longURL /* What goes here? */ };
  
  res.render("urls_show", templateVars);
});

//this function is called when a user navigates to /u/[any]
//it redirects to the actual website by using the longURL stored in the urlDatabse
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//
app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;

  //test code
  console.log('this is the database after:    ')
  console.log(urlDatabase);

  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  console.log(urlDatabase)

  res.redirect('/urls');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});