function setup(question) {
    switch (question) {
        case "Send":
            $("#que").text("send: a linked[in] message")
            break
        case "Kafka":
            $("#que").text("kafka")
            break
        case "Samza":
            $("#que").text("samza")
            break
        case "Brooklin":
            $("#que").text("brooklin")
            break
        case "Ambry":
            $("#que").text("ambry")
            break
        case "Espresso":
            $("#que").text("espresso")
            break
        case "Venice":
            $("#que").text("venice")
            break
        case "Liquid":
            $("#que").text("liquid")
            break
        case "Nuage":
            $("#que").text("nuage")
            break
        case "Gobblin":
            $("#que").text("gobblin")
            break
        default:
            break
   }    
}

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

function reset() {
    $("#ansbox").text("") 
    $("#anscheck").text("") 
}

function check(ans, checkAns) {
    reset()

    $("#ansbox").text(ans) 
    $("#anscheck").text(checkAns) 
    if (checkAns === "a linked[in] message") {    	
        $("#anscheck").css("color", "#0072b1") 
        $(".selected").addClass("correct");
        $("#ans").css("border-color", "#0072b1")
        return true
    }
    $("#anscheck").css("color", "#e44c65")
    return false
}


$(function() {
    $('#ans').keyup(function (e) {
        if (e.keyCode === 13) {
            let question = $(".selected").text().trim()
            let ans = $('#ans').val().trim()
            switch (question) {
                case "Send":
                    check(ans, send(ans))
                    break
                case "Kafka":
                    check(ans, kafka(ans))
                    break
                case "Samza":
                    check(ans, samza(ans))
                    break
                case "Brooklin":
                    check(ans, brooklin(ans))
                    break
                case "Ambry":
                    check(ans, ambry(ans))
                    break
                case "Espresso":
                    check(ans, espresso(ans))
                    break
                case "Venice":
                    check(ans, venice(ans))
                    break
                case "Liquid":
                    check(ans, liquid(ans))
                    break
                case "Nuage":
                    check(ans, nuage(ans))
                    break
                case "Gobblin":
                    check(ans, gobblin(ans))
                    break
                default:
                    break
           }    
        }
    }) 
    

    $(".question").hover(function(){
       $(".question").css("text-decoration", "none") 
       $(this).css("text-decoration", "underline") 
    }, function() {
        $(this).css("text-decoration", "none") 
    }) 

    $(".question").click(function(e) {
        $(".question").removeClass("selected") 
        $(this).addClass("selected") 
        $(this).css("text-decoration", "underline") 
        setup($(this).text())
        $('#ans').val("")
        reset()
    }) 
 }) 


$("#ans").focus(function(){
    if ($('.selected').hasClass("correct")) {
        $("#ans").css("border-color", "#0072b1")
    } else {
        $("#ans").css("border-color", "#e44c65")
    }
});
$("#ans").blur(function(){
    $("#ans").css("border-color", "rgba(255, 255, 255, 0.5)")
});