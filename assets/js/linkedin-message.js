function getTeam() {
    return sessionStorage.getItem("team");
}

function setTeam(teamname) {
    teamname = teamname.trim();
    return sessionStorage.setItem("team", teamname);
}

function setup(question) {
    switch (question) {
        case "Send":
            $("#que").text("send: a linked[in] message");
            break;
        case "Kafka":
            $("#que").text("kafka");
            break;
        case "Samza":
            $("#que").text("samza");
            break;
        case "Brooklin":
            $("#que").text("brooklin");
            break;
        case "Ambry":
            $("#que").text("ambry");
            break;
        case "Espresso":
            $("#que").text("espresso");
            break;
        case "Venice":
            $("#que").text("venice");
            break;
        case "Liquid":
            $("#que").text("liquid");
            break;
        case "Nuage":
            $("#que").text("nuage");
            break;
        case "Gobblin":
            $("#que").text("gobblin");
            break;
        default:
            break;
    }
}

function reset() {
    $("#ansbox").text("");
    $("#anscheck").text("");
}

function requestAns(ans, question, teamname) {
    question = question.toLowerCase().trim();
    return $.ajax({
        url: "/" + question,
        type: "POST",
        data: {
            team: teamname,
            ans: ans,
        },
        success: function (data, textStatus, jqXHR) {
            check(ans, data.message);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("server error...");
        },
    });
}

function check(ans, checkAns) {
    reset();

    $("#ansbox").text(ans);
    $("#anscheck").text(checkAns);
    if (checkAns === "a linked[in] message") {
        $("#anscheck").css("color", "#0072b1");
        $(".selected").addClass("correct");
        $("#ans").css("border-color", "#0072b1");
        return true;
    }
    $("#anscheck").css("color", "#e44c65");
    return false;
}

$(function () {
    $("#ans").keyup(function (e) {
        if (e.keyCode === 13) {
            let question = $(".selected").text().trim();
            let ans = $("#ans").val().trim();
            requestAns(ans, question, getTeam());
        }
    });

    $("#team").keyup(function (e) {
        if (e.keyCode === 13) {
            let teamname = $("#teamname").val().trim();
            setTeam(teamname);

            $("#team").css("visibility", "hidden");
            $("#game").css("visibility", "visible");
            $("#team-header").text("Team: " + getTeam());
        }
    });

    $(".question").hover(
        function () {
            $(".question").css("text-decoration", "none");
            $(this).css("text-decoration", "underline");
        },
        function () {
            $(this).css("text-decoration", "none");
        }
    );

    $(".question").click(function (e) {
        $(".question").removeClass("selected");
        $(this).addClass("selected");
        $(this).css("text-decoration", "underline");
        setup($(this).text());
        $("#ans").val("");
        reset();
    });

    if (getTeam() != null) {
        $("#team").css("visibility", "hidden");
        $("#game").css("visibility", "visible");
        $("#team-header").text("Team: " + getTeam());
    } else {
        $("#team").css("visibility", "visible");
        $("#game").css("visibility", "hidden");
    }
});

$("#ans").focus(function () {
    if ($(".selected").hasClass("correct")) {
        $("#ans").css("border-color", "#0072b1");
    } else {
        $("#ans").css("border-color", "#e44c65");
    }
});

$("#ans").blur(function () {
    $("#ans").css("border-color", "rgba(255, 255, 255, 0.5)");
});
