const express = require('express');
const app = express();
const path = require('path');
var fs = require('fs');
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('pages/index', { firstQuestion: GetData()[0] });
});

app.get('/result/:id', (req, res) => {
    res.render('pages/result', { books : GetBooksByAnswerId(req.params.id) });
});

app.get('/question', (req, res) => {
    var id = req.query.id;
    var data = GetQuestionByAnswerId(id);
    var result = id == undefined || data == undefined 
        ? { success: false, message: 'incorrect id.' } 
        : { success: true, data };

    res.send(result);
});

function GetData() {
    var db = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'db.json'), 'utf8')
        
        );
    return db;
}


function GetQuestionByAnswerId(id) {
    var data = GetData();
    for (var i = 0; i < data.length; i++) {
        if (data[i].parentAnswerId == id) {
            return data[i];
        }
    }
}

function GetBooksByAnswerId(id) {
    var data = GetData();
    for(var i = 0; i < data.length; i++) {
        var answers = data[i].answers;
        for(var j = 0 ; j < answers.length; j++){
            if(answers[j].id == id)
                return answers[j].books;
        }
    }
}

app.listen(port, () => console.log(`Application listening on ${port}`));