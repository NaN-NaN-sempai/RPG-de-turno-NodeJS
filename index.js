console.clear();

var express = require("express");
var bodyParser = require('body-parser');
var app = express();

var classes = require("./classes");
var races = require("./races");
var weapons = require("./weapons");
var difficulties = require("./difficulties");

var fs = require("fs");

var randomOperations = require("./myModules/randomOperations");
var generateRandomName = require("./myModules/randomNameGenerator");

 

var pages = [];
var pagesIndex = "./content/pages";
var loadPages = () => {
    fs.readdirSync(pagesIndex).forEach(fileName => { 
        var file = fs.readFileSync(pagesIndex+"/"+fileName, 'utf8').split("<!-- SPLIT FOR SCRIPT -->");
        pages.push({
            name: fileName.replace(".html", ""),
            content: file[0],
            button: file[1]?.replace("<script>", "").replace("</script>", ""),
            script: file[2]?.replace("<script>", "").replace("</script>", "")
        });
    });
}
loadPages();

/* AUTO LOAD SCRIPTS */
fs.watch(pagesIndex, () => {
    pages = [];
    loadPages();
    console.clear(); 
    console.log('\x1b[36m', "Reloaded Pages", '\x1b[0m'); 
}); 



app.use(bodyParser.json());
 
app.use(express.static(__dirname+'/content'))

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/");
});



app.post('/randomOperations', (req, res)=> {
    var operation = Object.entries(req.body)[0];
    
    if(randomOperations[operation[0]]){
        var ret = randomOperations[operation[0]](operation[1][0], operation[1][1]);
        res.json(ret);
    }
     
    res.end();
})

app.post('/randomName', (req, res)=> {
    var obj = req.body;
    res.json(generateRandomName(obj));
    res.end();
});

app.post('/newEntity', (req, res)=> { 
    var operation = req.body; 
    
    if(classes[operation[0]]){ 
        var ret = new classes[operation[0]](operation[1]); 
        res.json(ret);
    }
     
    res.end();
});

app.get("/serverData", (req, res) => {
    res.json({
        modules: {
            races: races,
            difficulties: difficulties,
            weapons: weapons
        },
        pages: pages,
        randomOperations: randomOperations.evalText
    });
    res.end();
});

var port = 80;
app.listen(port, () => {
    console.log('\x1b[33m%s\x1b[0m', "Server Started.");
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
        console.log("Ip Link:", '\x1b[36m', 'http://'+ add + ":" + port +"/",'\x1b[0m');
        console.log("Localhost Link:", '\x1b[36m', 'http://localhost:' + port +"/",'\x1b[0m');
    });
});