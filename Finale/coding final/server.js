const express = require("express");
const app = express();
const cors = require('cors');
const db = require('./db'); 

app.use(cors());
app.use(express.json());


let students = [
  { id: 1, name: "Anjali" },
  { id: 2, name: "Ravi" }
];


app.get("/", (request, response) => {
    // res.set(X-Powered-By, Anjali) 
	  response.send("Hello World!, Anjali");
});

app.get("/page", (req, res) => {  	
	res.sendFile("./page.html", { root: __dirname });
});

app.get('/user/:userId/post/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.send(`User ID: ${userId}, Post ID: ${postId}`);
});

app.get('/search', (req, res) => {
  const term = req.query.term;
  const category = req.query.category;
  res.send(`Searching for: ${term} in ${category}`);
});

app.get('/check', (req, res) => {
  console.log(req.headers); // Shows all headers
  const contentType = req.headers['host'];
  res.send(`Content type sent: ${contentType}`);
});

app.get('/hello', (req, res) => {
  res.redirect('/welcome');
});

app.get('/welcome', (req, res) => {
    console.log(req.method);
  res.send('Welcome to the redirected page!');
  
});

//connected to databse 
app.get('/api/students', (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.post('/students', (req, res) => {
  const newStudent = req.body;
  students.push(newStudent);
  const contentType = req.headers['content-type'];
  console.log(contentType);
//   res.set(X-Powered-By, Anjali) 
  res.status(201).json({ message: 'Student added', data: newStudent });
});

//connection with database
app.post('/api/students', (req, res) => {
  const { name, age } = req.body;

  db.run("INSERT INTO students (name, age) VALUES (?, ?)", [name, age], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, age });
  });
});

app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  students = students.map(s => s.id === id ? { ...s, ...updatedData } : s);
  res.json({ message: 'Student updated', data:students });
});

//connected to database
app.put('/api/students/:id', (req, res) => {
  const { name, age } = req.body;
  const { id } = req.params;

  db.run("UPDATE students SET name = ?, age = ? WHERE id = ?", [name, age, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Student with ID ${id} updated` });
  });
})

app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  students = students.filter(s => s.id !== id);
  res.json({ message: `Student with id ${id} deleted`, data:students });
});

//connection with database
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM students WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Student with ID ${id} deleted` });
  });
});




app.listen(3001 , ()=>{
    console.log("server started");
});


