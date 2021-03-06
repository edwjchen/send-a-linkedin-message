var http = require("http"),
    express = require("express"),
    path = require("path"),
    crypto = require("crypto"),
    port = process.env.PORT || 3000;

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/images", express.static(__dirname + "/images"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/leaderboard", function (req, res) {
    res.sendFile(path.join(__dirname, "leaderboard.html"));
});

let leaderboard = new Map();
let answerTime = new Map();

app.get("/getLeaderboard", function (req, res) {
    res.status(200).send({
        lb: JSON.stringify(leaderboard, replacer),
    });
});

function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()),
        };
    } else if (value instanceof Set) {
        return {
            dataType: "Set",
            value: [...value],
        };
    } else {
        return value;
    }
}

function check(ans) {
    if (ans == "a linked[in] message") {
        return true;
    }
    return false;
}

function updateScore(team, question) {
    if (!leaderboard.has(team)) {
        leaderboard.set(team, new Set());
        answerTime.set(team, Date.now());
    }

    if (!leaderboard.get(team).has(question)) {
        answerTime.set(team, Date.now());
    }
    leaderboard.get(team).add(question);

    updateLeaderboard();
}

function updateLeaderboard() {
    teams = [];
    for (let [key, value] of leaderboard) {
        if (!answerTime.has(key)) answerTime.set(key, 0);
        teams.push([
            key,
            value.size,
            answerTime.get(key),
            Array.from(leaderboard.get(key)),
        ]);
    }

    teams.sort(function (a, b) {
        if (a[2] == b[2]) return 0;
        return a[2] < b[2] ? -1 : 1;
    });

    teams.sort(function (a, b) {
        if (a[1] == b[1]) return 0;
        return a[1] > b[1] ? -1 : 1;
    });

    let lb = new Map();

    for (let [team, _a, _b, _c] of teams) {
        lb.set(team, leaderboard.get(team));
    }

    leaderboard = lb;
}

function send(ans) {
    return ans;
}

function kafka(ans) {
    res = [];
    words = ans.split(" ");
    words.forEach((word) => {
        if (word.startsWith("ka") && word.endsWith("ka")) {
            res.push(word.slice(2, -2));
        } else {
            res.push("f");
        }
    });
    return res.join(" ");
}

function samza(ans) {
    res = [];
    words = ans.split(" ");
    words.forEach((word) => {
        chars = word.match(/..?/g);
        newWord = "";
        chars.forEach((char) => {
            if (char[0] == char[1]) newWord += char[0];
        });
        res.push(newWord);
    });
    return res.join(" ");
}

function brooklin(ans) {
    res = [];
    chars = ans.split("");
    for (var i = 0; i < chars.length; i++) {
        if (i >= chars.length / 2) {
            res.push(chars[chars.length + chars.length / 2 - i - 1]);
        } else {
            res.push(chars[i]);
        }
    }
    return res.join("");
}

function ambry(ans) {
    emojis = ["????", "????", "??????", "????", "????"];
    seen = [];
    res = [];
    words = ans.split(" ");
    for (var i = 0; i < words.length; i++) {
        word = words[i];

        if (seen.includes(word)) {
            res.push("seenlinked[in]emoji");
            continue;
        }

        if (i == 0) {
            if (emojis.includes(word)) {
                res.push("a");
                seen.push(word);
            } else {
                res.push("wronglinked[in]emoji");
            }
        } else if (i == 1) {
            if (emojis.includes(word)) {
                res.push("linked[in]");
                seen.push(word);
            } else {
                res.push("wronglinked[in]emoji");
            }
        } else {
            if (emojis.includes(word)) {
                res.push("message");
                seen.push(word);
            } else {
                res.push("wronglinked[in]emoji");
            }
        }
    }

    return res.join(" ");
}

function espresso(ans) {
    res = [];
    words = ans.split(" ");
    words.forEach((word) => {
        pre = word.slice(0, -3);
        last = word.slice(-1);
        first = word.slice(-3, -2);
        second = word.slice(-2, -1);
        if (first != second) {
            res.push(pre + last);
        } else {
            res.push(pre + first + last);
        }
    });
    return res.join(" ");
}

function venice(ans) {
    res = [];
    words = ans.split(" ");
    words.forEach((word) => {
        if (!word.includes(":")) {
            res.push("missing:");
        } else if ((word.match(/\:/) || []).length != 1) {
            res.push("toomany:");
        } else {
            kv = word.split(":");
            k = kv[0];
            v = kv[1];
            if (k != v) {
                res.push("k!=v");
            } else {
                res.push(k);
            }
        }
    });
    return res.join(" ");
}

function liquid(ans) {
    chars = ans.split("");
    res = [];
    cipher = new Date().getHours() + 1;
    chars.forEach((char) => {
        switch (char) {
            case " ":
                res.push(char);
                break;
            case "]":
                res.push(char);
                break;
            case "[":
                res.push(char);
                break;
            default:
                charCode = char.charCodeAt(0);
                res.push(
                    String.fromCharCode(
                        charCode + cipher <= 122
                            ? charCode + cipher
                            : ((charCode + cipher) % 122) + 96
                    )
                );
                break;
        }
    });
    return res.join("");
}

function nuage(ans) {
    if (!ans.startsWith("un")) return "tu parles fran??ais?";
    words = ans.split(" ");
    if (words.length > 1) {
        last = words[words.length - 1];
        slast = words[words.length - 2];
        words[words.length - 1] = slast;
        words[words.length - 2] = last;
    }
    ans = words.join(" ");
    ans = ans.replace("un ", "a ");
    return ans;
}

function gobblin(ans) {
    res = [];
    chars = ans.split("");
    chars.forEach((char) => {
        if (char == "e") res.push("e");
        res.push(char);
    });

    ans = res.join("");
    res = [];

    words = ans.split(" ");
    words.forEach((word) => {
        matches = word.match(/\[..?\]/g);
        if (matches != null) {
            matches.forEach((match) => {
                newMatch = match.slice(1, -2);
                word = word.replace(match, newMatch);
            });
        }
        res.push(word);
    });
    return res.join(" ");
}

function numa(ans) {
    res = [];

    chars = ans.split("");

    for (var i = 0; i < chars.length; i += 2) {
        if (i + 1 < chars.length) {
            res.push(chars[i + 1]);
        }

        res.push(chars[i]);
    }

    return res.join("");
}

function ctf(ans) {
    const algorithm = "aes-128-cbc";
    const password = "veniceveniceveni";

    try {
        var decipher = crypto.createDecipheriv(
            algorithm,
            password,
            "0000000000000000"
        );
        var plain =
            decipher.update(ans, "base64", "utf8") + decipher.final("utf8");

        if (plain != "a linked[in] message") {
            return "answer is encrypted... maybe I need to search somewhere else";
        }

        return plain;
    } catch (e) {
        return "answer is encrypted... maybe I need to search somewhere else";
    }
}

function pymk(ans) {
    res = [];
    words = ans.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (i == 0) {
            res.push(words[i] == "ryan" ? "a" : "ceo");
        } else if (i == 1) {
            res.push(words[i] == "raghu" ? "linked[in]" : "cto");
        } else if (i == 2) {
            res.push(words[i] == "mohak" ? "message" : "svp-eng");
        } else {
            res.push("who?");
        }
    }
    return res.join(" ");
}

app.post("/send", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = send(ans);

    if (check(message)) {
        updateScore(team, "send");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/brooklin", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = brooklin(ans);

    if (check(message)) {
        updateScore(team, "brooklin");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/kafka", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = kafka(ans);

    if (check(message)) {
        updateScore(team, "kafka");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/samza", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = samza(ans);

    if (check(message)) {
        updateScore(team, "samza");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/ambry", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = ambry(ans);

    if (check(message)) {
        updateScore(team, "ambry");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/espresso", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = espresso(ans);

    if (check(message)) {
        updateScore(team, "espresso");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/venice", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = venice(ans);

    if (check(message)) {
        updateScore(team, "venice");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/liquid", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = liquid(ans);

    if (check(message)) {
        updateScore(team, "liquid");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/nuage", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = nuage(ans);

    if (check(message)) {
        updateScore(team, "nuage");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/gobblin", function (req, res) {
    let team = req.body.team.toLowerCase().trim();
    let ans = req.body.ans;
    let message = gobblin(ans);

    if (check(message)) {
        updateScore(team, "gobblin");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/numa", function (req, res) {
    let team = req.body.team.toLowerCase();
    let ans = req.body.ans;
    let message = numa(ans);

    if (check(message)) {
        updateScore(team, "numa");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/ctf", function (req, res) {
    let team = req.body.team.toLowerCase();
    let ans = req.body.ans;
    let message = ctf(ans);

    if (check(message)) {
        updateScore(team, "ctf");
    }

    res.status(200).send({
        message: message,
    });
});

app.post("/pymk", function (req, res) {
    let team = req.body.team.toLowerCase();
    let ans = req.body.ans;
    let message = pymk(ans);

    if (check(message)) {
        updateScore(team, "pymk");
    }

    res.status(200).send({
        message: message,
    });
});

var server = http.createServer(app);

server.listen(port);
console.log("Server running at http://127.0.0.1:" + port + "/");
