getLeaderboard();

function reviver(key, value) {
    if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
            return new Map(value.value);
        }

        if (value.dataType === "Set") {
            return new Set(value.value);
        }
    }
    return value;
}

function getLeaderboard() {
    $.ajax({
        url: "/getLeaderboard",
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            data.lb = JSON.parse(data.lb, reviver);
            populateLeaderboard(data.lb);
        },
        error: function (jqXHR, textStatus, errorThrown) {},
    });
    setInterval(function () {
        $.ajax({
            url: "/getLeaderboard",
            type: "GET",
            success: function (data, textStatus, jqXHR) {
                populateLeaderboard(data.lb);
            },
            error: function (jqXHR, textStatus, errorThrown) {},
        });
    }, 60 * 1000);
}

function populateLeaderboard(lb) {
    myteam = sessionStorage.getItem("team");

    lb = new Map([...lb.entries()].sort((a, b) => a[1].size > b[1].size));

    let count = 0;
    let rank = count + 1;

    [...lb.entries()].forEach(function (v) {
        team = v[0];
        ans = v[1];

        let sortedAns = Array.from(ans).sort(function (a, b) {
            return a - b;
        });

        let numSolved = sortedAns.length;

        if (count == 0) {
            $("#lb").append(
                '<tr><td><span style="color: #ffd700;">1st</span></td><td>' +
                    team +
                    "</td><td>" +
                    sortedAns +
                    "</td><td>" +
                    numSolved +
                    "/" +
                    sortedAns.length +
                    "</td></tr>"
            );
            if (team == myteam) {
                $(".in-team").append(
                    team + ' placed <span style="color: #ffd700;">1st!</span>'
                );
            }
        } else if (count == 1) {
            $("#lb").append(
                '<tr><td><span style="color: #c0c0c0;">2nd</span></td><td>' +
                    team +
                    "</td><td>" +
                    sortedAns +
                    "</td><td>" +
                    numSolved +
                    "/" +
                    sortedAns.length +
                    "</td></tr>"
            );
            if (team == myteam) {
                $(".in-team").append(
                    team + ' placed <span style="color: #c0c0c0;">2nd!</span>'
                );
            }
        } else if (count == 2) {
            $("#lb").append(
                '<tr><td><span style="color: #cd7f32;">3rd</span></td><td>' +
                    team +
                    "</td><td>" +
                    sortedAns +
                    "</td><td>" +
                    numSolved +
                    "/" +
                    sortedAns.length +
                    "</td></tr>"
            );
            if (team == myteam) {
                $(".in-team").append(
                    team + ' placed <span style="color: #cd7f32;">3rd!</span>'
                );
            }
        } else {
            $("#lb").append(
                "<tr><td>" +
                    rank +
                    "th</td><td>" +
                    team +
                    "</td><td>" +
                    sortedAns +
                    "</td><td>" +
                    numSolved +
                    "/" +
                    sortedAns.length +
                    "</td></tr>"
            );
            if (team == myteam) {
                $(".in-team").append(
                    team +
                        ' placed <span style="color: #f2849e;">' +
                        rank +
                        "th!</span>"
                );
            }
        }
        count++;
        rank = count + 1;
    });
}
