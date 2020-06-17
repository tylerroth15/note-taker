// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "Develop/public")));

// Initialize HTML

let noteDump =[];
let counterID = 0;

//Add Code Here
app.get("/api/notes", function(req, res) {
try{
    noteDump = fs.readFileSync("./Develop/db/db.json", 'utf8');
    console.log("IT WORKED!")
    noteDump = JSON.parse(noteDump);
    }

    catch (err){
        console.log(err);
    }

    res.json(noteDump);
});

//Creating new notes
app.post("/api/notes", function(req, res) {
    try {

        //reads the json file
        noteDump = fs.readFileSync("./Develop/db/db.json", "utf8");
        console.log(noteDump);

        //parse the new note created into the json file
        noteDump =JSON.parse(noteDump);
        req.body.id = counterID;
        counterID++;

        noteDump.push(req.body);
        noteDump = JSON.stringify(noteDump);
        fs.writeFile("./Develop/db/db.json", noteDump, "utf8", function(err) {

            if (err) throw err;
        });

        res.json(JSON.parse(noteDump));
    }
    catch (err){
        throw err;
        console.error(err);
    }
});

//Deleting the note
app.delete("/api/notes/:id", function(req,res) {
    try{
        noteDump = fs.readFileSync("./Develop/db/db.json", "utf8");
        noteDump = JSON.parse(noteDump);
        noteDump = noteDump.filter(function(note){
            return note.id !=req.params.id
        });

        noteDump = JSON.stringify(noteDump);
        fs.writeFile("./Develop/db/db.json", noteDump, "utf8", function(err){
            if (err) throw err;
        });

        res.send(JSON.parse(noteDump));
    } catch (err){
        throw err;
    }    
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});