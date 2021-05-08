const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = require(path.join(__dirname, "/db/db.json"));
console.log(db);


app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res){
    res.json(db);
});

app.post("/api/notes", function(req, res){
    var newNote = req.body;

        if(db.length === 0)
        {
            newNote.id = 0;
        }
        else{
            newNote.id = db[db.length - 1].id + 1;
        }
        db.push(newNote);
        console.log(db);
    
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(db), function(err){
            if(err) 
                throw err;
            else 
                res.send("Note Succesfully added!");
        });
    }
    
);

app.delete("/api/notes/:id", function(req, res){
    var id = req.params.id;

    var noteToDelete = db.find((note) => note.id == id);
    if(noteToDelete)
    {
        db.splice(db.indexOf(noteToDelete), 1);
    }

    // var newNotes = db.filter(note => note.id != id);
    // console.log(newNotes);

    fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(db), function(err){
        
        if(err) 
            throw err;
        else 
            res.send("File deleted succesfully");
    });
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

function checkIndex(id){
    return db.id === id;
}