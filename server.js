var http = require('http'),
    express = require('express'),
    path = require('path'),
    port = process.env.PORT || 3000;


var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/assets", express.static(__dirname+"/assets"));
app.use("/images", express.static(__dirname+"/images"));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/leaderboard', function(req, res){
    res.sendFile(path.join(__dirname, 'leaderboard.html'));
})

app.get('/getLeaderboard', function(req, res){
    if (lastLeaderboard + 60*1000 < Date.now()) {
      updateLeaderboard();
    }
    res.send({lb:leaderboard})
  })

function send(ans) {
    return ans
}

function kafka(ans) {
    res = []
    words = ans.split(" ")
    words.forEach((word) => {
        if (word.startsWith("ka") && word.endsWith("ka")) {
            res.push(word.slice(2,-2))
        } else {
            res.push("f")
        }
    })
    return res.join(" ")
}

function samza(ans) {
    res = []
    words = ans.split(" ")
    words.forEach((word) => {
        chars = word.match(/..?/g)
        newWord = ""
        chars.forEach((char) => {
            if (char[0] == char[1]) newWord += char[0]
        })
        res.push(newWord)
    })
    return res.join(" ")
}

function brooklin(ans) {
    res = []
    chars = ans.split("")
    for (var i=0; i < chars.length; i++) {
        if (i >= chars.length / 2) {
            res.push(chars[chars.length + (chars.length / 2) - i - 1])
        } else {
            res.push(chars[i])
        }
    }
    return res.join("")
}

function ambry(ans) {
    emojis = ["👍", "👏", "❤️", "💡", "🤔"]
    seen = []
    res = []
    words = ans.split(" ")
    for (var i = 0; i < words.length; i++) {
        word = words[i]

        if (seen.includes(word)) {
            res.push("seenlinked[in]emoji")
            continue
        }

        if (i == 0) {
            if (emojis.includes(word)) {
                res.push("a")
                seen.push(word)
            } else {
                res.push("wronglinked[in]emoji")
            }
        } else if (i == 1) {
            if (emojis.includes(word)) {
                res.push("linked[in]")
                seen.push(word)
            } else {
                res.push("wronglinked[in]emoji")
            }
        } else {
            if (emojis.includes(word)) {
                res.push("message")
                seen.push(word)
            } else {
                res.push("wronglinked[in]emoji")
            }
        } 
    }

    return res.join(" ")
}

function espresso(ans) {
    res = []
    words = ans.split(" ")
    words.forEach((word) => {
        pre = word.slice(0, -3)
        last = word.slice(-1)
        first = word.slice(-3, -2)
        second = word.slice(-2, -1)
        if (first != second) {
            res.push(pre+last)
        } else {
            res.push(pre + first + last)
        }
    })
    return res.join(" ")
}

function venice(ans) {
    res = []
    words = ans.split(" ")
    words.forEach((word) => {
        if (!word.includes(":")) {
            res.push("missing:")
        } else if ((word.match(/\:/) || []).length != 1) {
            res.push("toomany:")
        } else {
            kv = word.split(":")
            k = kv[0]
            v = kv[1]
            if (k != v) {
                res.push("k!=v")
            } else {
                res.push(k)
            }
        }
    })
    return res.join(" ")
}

function liquid(ans) {
    chars = ans.split("")
    res = []
    cipher = new Date().getHours() + 1
    chars.forEach((char) => {
        switch(char) {
            case " ":
                res.push(char)
                break
            case "]":
                res.push(char)
                break
            case "[":
                res.push(char)
                break
            default:
                charCode = char.charCodeAt(0)
                res.push(String.fromCharCode(((charCode + cipher) <= 122) ? charCode + cipher : (charCode + cipher) % 122 + 96))
                break
        }
    })
    return res.join("")
}

function nuage(ans) {
    if (!ans.startsWith("un")) return "tu parles français?"
    words = ans.split(" ")
    if (words.length > 1) {
        last = words[words.length - 1]
        slast = words[words.length - 2]
        words[words.length - 1] = slast
        words[words.length - 2] = last
    }
    ans = words.join(" ")
    ans = ans.replace("un ", "a ")
    return ans
}

function gobblin(ans) {
    res = []
    chars = ans.split("")
    chars.forEach((char) => {
        if (char == "e") res.push("e")
        res.push(char)
    })

    ans = res.join("")
    res = []

    words = ans.split(" ")
    words.forEach((word) => {
        matches = word.match(/\[..?\]/g)
        if (matches != null) {
            matches.forEach((match) => {
                newMatch = match.slice(1, -2)
                word = word.replace(match, newMatch)
            })
        }
        res.push(word)
    })
    return res.join(" ")
}

app.post('/send', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = send(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/brooklin', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = brooklin(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/kafka', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = kafka(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/samza', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = samza(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/ambry', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = ambry(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/espresso', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = espresso(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/venice', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = venice(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/liquid', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = liquid(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/nuage', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = nuage(ans)
    res.status(200).send({
        message: messsage
    });
})

app.post('/gobblin', function(req, res){
    let team = req.body.team.toLowerCase().trim()
    let ans = req.body.ans
    let messsage = gobblin(ans)
    res.status(200).send({
        message: messsage
    });
})

var server = http.createServer(app);

server.listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');