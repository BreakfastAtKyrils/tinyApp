const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 8080; 

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
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
  'b2xVn2' : "http://www.lighthouselabs.ca",
  '9sm5xK' : "http://www.google.com"
};

//this function shows the json object when we navigate to /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"],
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  const templateVars = { 
    shortURL: shortURL ,
    longURL: longURL, 
    username: req.cookies["username"],   
  };
  
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  res.render('register', {})
})


app.post( '/urls/:id', (req, res) => {
  const shortURL = req.params.id

  console.log(req)

  console.log('you just clicked the edit button')
  res.redirect(`/urls/${shortURL}`)
})

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect("/urls")
})

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect("/urls")
})


app.post("/urls", (req, res) => {
  //console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;

  //test code
  console.log('this is the database after:    ')
  console.log(urlDatabase);
  res.redirect('/urls')
  //res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL]
  console.log('you just deleted a URL, here is the new database:')
  console.log(urlDatabase)

  res.redirect('/urls');
})



app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});