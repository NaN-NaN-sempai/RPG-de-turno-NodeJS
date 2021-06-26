console.clear();

var express = require("express");
var app = express();

var classes = require("./classes");

var fs = require("fs");

var races = require("./races");


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





app.use(express.static(__dirname+'/content'))

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/");
});





var player = {name: "Link, the Hylian"};

app.get("/serverData", (req, res) => {
    res.json({
        player: player,
        races: races,
        pages: pages
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