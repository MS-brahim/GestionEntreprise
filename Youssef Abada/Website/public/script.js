/*jshint esversion: 6 */
$(document).ready(function () {
    if (window.location.pathname === "/")
        loadEntreprises();

    if (window.location.pathname === "/department.html")
        loadDepartmentInfo();

    if (window.location.pathname === "/search.html")
        loadSearchResult();
});

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

function loadDepartmentInfo() {
    ajaxRequest("GET", "/api/departement/", res => {
        if (Object.keys(res).length === 0) window.location.replace('/');
        document.getElementById("departName").innerHTML = res.name;
        document.getElementById("modalDepTitle").innerHTML = res.name;
        document.getElementById("entrepriseName").innerHTML = res.entrepriceName;
        document.getElementById("departDisc").innerHTML = res.discription;
        document.getElementById("departChef").innerHTML = res.chef;
        document.getElementById("departSalaries").innerHTML = res.salaries.length;
        document.getElementById("addBtn").addEventListener('click', function () {
            addSalary(res.entrepriceID, res.id);
        });
        for (let s in res.salaries) {
            document.getElementById("salTable").innerHTML += '<tr><td>' + res.salaries[s].matricule + '</td><td>' + res.salaries[s].name + '</td><td>' + res.salaries[s].lastName + '</td><td>' + res.salaries[s].age + '</td><td>' + res.salaries[s].salaire + '</td></tr>';
        }
    });
}

function addSalary(eId, dId) {
    ajaxRequest("POST", "/api/departement/" + eId + "/" + dId, res => {
        window.location.replace('/department/?entId=' + eId + '&depId=' + dId);
    }, {
        matricule: document.getElementById("matriculeSalary").value,
        name: document.getElementById("nameSalary").value,
        lastName: document.getElementById("lnameSalary").value,
        age: +document.getElementById("ageSalary").value,
        salaire: document.getElementById("salaire").value
    });
}

function loadEntreprises() {
    ajaxRequest("GET", "/api/entreprises", res => {
        document.getElementById("entreprises").innerHTML = "";
        for (let e in res) {
            let enter = "";
            enter += "<div class='col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2'>";
            enter += "<div class='ent'><h3 class='ent-name'>" + res[e].name + "</h3>";
            enter += "<div class='ent-body'><p class='ent-disc'>" + res[e].discription + "</p>";
            enter += "<p class='show-more text-primary' data-toggle='collapse' data-target='#detail" + res[e].id + "'>Plus d'info ▼</p>";
            enter += "<div id='detail" + res[e].id + "' class='collapse'><div class='ent-detail'>";
            enter += "<div style='width: 100%; height:150px;'>";
            let adress = res[e].location.replace(/ /g, "+").replace(/,/g, "");
            enter += '<iframe width="100%" height="170" frameborder="0" src="https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q=' + adress + '&z=14&output=embed"></iframe></div>';
            enter += "<p class='text-primary'></p><div class='detail-text'><p style='width: 50%;'>" + res[e].location + "</p>'<p class='text-primary'></p><div class='detail-text'>";
            enter += "<p><span class='text-primary'>" + res[e].deprartments.length + "</span> déprartments</p></div></div>";
            enter += "<p class='show-less text-primary' data-toggle='collapse' data-target='#detail" + res[e].id + "'>Montrer moins ▲</p></div>";
            enter += `</div><button onclick="showDepatements(${res[e].id})" data-toggle="modal" data-target="#showDepatments" type="button" class="btn btn-primary btn-block" style="border-radius: 8px; font-size: .9em; background-color: #5599FF; color: white;">Afficher / ajouter des départements</button></div></div>`;
            document.getElementById("entreprises").innerHTML += enter;
        }
        toggleEffect();
    });
}

function toggleEffect() {
    let show = document.getElementsByClassName('show-more');
    let hide = document.getElementsByClassName('show-less');
    let disc = document.getElementsByClassName('ent-disc');
    for (let i = 0; i < show.length; i++) {
        show[i].addEventListener('click', function () {
            this.style.display = "none";
            disc[i].style.height = "auto";
        });
        hide[i].addEventListener('click', function () {
            show[i].style.display = "block";
            disc[i].style.height = "70px";
        });
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

function addEntreprise() {
    ajaxRequest("POST", "/api/entreprises", res => {
        loadEntreprises();
    }, {
        name: document.getElementById("nomEnt").value,
        discription: document.getElementById("discEntr").value,
        location: document.getElementById("locEnt").value,
        deprartments: []
    });
}

function showDepatements(id) {
    ajaxRequest("GET", "/api/entreprises/" + id, res => {
        let deprartments = res.deprartments;
        document.getElementById("entrOfDep").innerHTML = res.name;
        removeClickListeners("showDepBtn");
        document.getElementById("showDepBtn").addEventListener('click', function () {
            AddDepartmentModal(res.id, res.name);
        });
        let rows = "";
        for (let d in deprartments) {
            rows += '<tr><td>' + deprartments[d].id + '</td><td>' + deprartments[d].name + '</td><td><a href="/department/?entId=' + id + '&depId=' + deprartments[d].id + '">plus de info <i class="fa fa-chevron-right" style="font-size:20px;"></i></a></td></tr>';
        }
        document.getElementById("depTable").innerHTML = rows;
    });
}

function AddDepartmentModal(id, name) {
    document.getElementById("EnterpName").innerHTML = name;
    removeClickListeners("addDepBtn");
    document.getElementById("addDepBtn").addEventListener("click", function () {
        addDepartment(id);
    });
}

function addDepartment(id) {
    ajaxRequest("POST", "/api/entreprises/" + id, res => {
        loadEntreprises();
        showDepatements(id);
    }, {
        name: document.getElementById("nomDep").value,
        chef: document.getElementById("chefDep").value,
        discription: document.getElementById("discDep").value,
        salaries: []
    });
}

function removeClickListeners(btnId) {
    let old_element = document.getElementById(btnId);
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
}