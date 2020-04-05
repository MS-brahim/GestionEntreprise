/*jshint esversion: 6 */
loadSearchResult();

function ajaxRequest(method, url, callback, data) {
    let request = new XMLHttpRequest();
    request.onload = function () {
        let res = null;
        if (this.status == 200) {
            if (method === "GET")
                res = JSON.parse(this.responseText);
            callback(res);
        }
    };
    request.open(method, url, true);

    if (method === "POST") {
        data = JSON.stringify(data);
        request.setRequestHeader("Content-type", "application/json");
        request.send(data);
    }
    if (method === "GET") {
        request.send();
    }
}

function searchSalary(event, input) {
    if (event.keyCode === 13) {
        window.open('/search/?name=' + input.value, "_self");
    }
}

function loadSearchResult() {
    ajaxRequest("GET", "/api/search", res => {
        document.getElementById("salaryInfo").innerHTML = "";
        if (res.length > 0) {
            document.getElementById("searchFor").innerHTML = "Vous cherchez <span class='text-primary'>" + res[0].name.toUpperCase() + "</span>";
            for (let s in res) {
                document.getElementById("salaryInfo").innerHTML += '<tr><td>' + res[s].matricule + '</td><td>' + res[s].entrepriceName + '</td><td>' + res[s].departementName + '</td><td>' + res[s].name + '</td><td>' + res[s].lastName + '</td><td>' + res[s].age + '</td><td>' + res[s].salaire + '</td></tr>';
            }
        } else {
            document.getElementById("searchFor").innerHTML = "Aucun résultat trouvé!".toUpperCase();
        }
    });
}

