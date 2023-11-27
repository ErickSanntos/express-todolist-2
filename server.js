const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection; // ??? the way you sort things 

const url = "mongodb+srv://erickbeast1:pspdc4732@cluster0.jqdvfrc.mongodb.net/todo?retryWrites=true&w=majority";
const dbName = "todo";

app.listen(3000, () => { // creates a server express needs to listen to 
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => { // port 3000 
        if(error) {
            throw error; // errors catch 
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public')) // i think its the server not sure maby cloud 

app.get('/', (req, res) => {
  db.collection('todo').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {todo : result})
    
  })

})

app.post('/todo', (req, res) => {
  db.collection('todo').insertOne({name: req.body.name, completed:' false'}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/todo', (req, res) => {
  const name = req.body.name;
  db.collection('todo').findOneAndUpdate(
    { name: name },
    {
      $set: {
        completed: !req.body.completed // Toggle the 'completed' field value
      }
    },
    {
      sort: { _id: -1 },
      upsert: true
    },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});


// app.put('/todo', (req, res) => { // false 
//   db.collection('todo')
//   .findOneAndUpdate({name: req.body.name},{
//     $set: {
//       completed : 'false'
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })

app.delete('/todo', (req, res) => {
  db.collection('todo').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
