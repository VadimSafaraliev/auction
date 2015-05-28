setInterval(function () {
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost/sync";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            myFunction(myArr);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}, 300);

function myFunction(arr) {
    var out = "";
    if (arr.end) out = "<h3>Game ended!</h3><hr>";
    if (arr.wait) out = "Wait for game start..";
    if (arr.start) {
        out = "Your goods: " + arr.name + "<br>" + "Your price:" + arr.price;

    }
    var winnerName;
    var maxScore = 0;
    if (arr.statistic) {
        out += "Name user: " + arr.username + "<br>";
        out += "Score: " + arr.score;
        out += "<hr>";
        for (var j = 0; j < arr.usersArray.length; j++) {
            if (maxScore < arr.usersArray[j].score) {
                maxScore = arr.usersArray[j].score;
                winnerName = arr.usersArray[j].name;
            }
        }
    }
    if (winnerName == arr.username && arr.end) out += "<h3>You win!</h3>";
    else if(arr.end) out += "<h3>You lose!</h3>";
    document.getElementById("id").innerHTML = out;
}