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
}, 500);

function myFunction(arr) {
    var out = "";
    if (arr.end) out = "<h3>Game ended!</h3><hr>";
    if (arr.wait) out = "Wait for game start..";
    if (arr.start) {
        out = "Now goods: " + arr.name + "<br>" + "Now price:" + arr.price + "<br>" + "Number session:" + arr.numberSession;
    }
    var maxScore=-9999;
    var winnerName='';
    if (arr.statistic) {
        for (var j = 0; j < arr.usersArray.length; j++) {
            if (maxScore <= arr.usersArray[j].score) {
                maxScore = arr.usersArray[j].score;
                winnerName = arr.usersArray[j].name;
            }

            out += "Username: " + arr.usersArray[j].name + "<br>";
            for (var i = 0; i < arr.statData.length; i++) {
                if (arr.usersArray[j].name == arr.statData[i].name) {
                    out += "Bought: " + arr.statData[i].goods + "<br>";
                    out += "Price: " + arr.statData[i].price + "<br>";
                }
            }
            out += "Score: " + arr.usersArray[j].score + "<hr>";
        }
        out += "<h1>WINNER: " + winnerName + "</h1>";

    }


    document.getElementById("adminstat").innerHTML = out;
}