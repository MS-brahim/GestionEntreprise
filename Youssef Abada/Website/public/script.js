/*jshint esversion: 6 */
$(document).ready(function () {
    if (window.location.pathname === "/") {
        loadEntreprises();
    }
    if (window.location.pathname === "/department.html") {
        loadDepartmentInfo();
    }
    if(window.location.pathname === "/search.html") {
        loadSearchResult();
    }
});

function loadDepartmentInfo() {
    let request = new XMLHttpRequest();
    request.open("GET", "/api/departement/", true);
    request.onload = function () {
        if (this.status == 200) {
            let departement = JSON.parse(this.responseText);
            document.getElementById("departName").innerHTML = departement.name + " <small>entreprise name <strong>" + departement.entrepriceName + "</strong> id(<strong>" + departement.entrepriceID + "</strong>)</small>";
            document.getElementById("depInfo").innerHTML = '<tr><td>' + departement.id + '</td><td>' + departement.name + '</td><td>' + departement.chef + '</td><td>' + departement.discription + '</td><td>' + departement.salaries.length + '</td></tr>';
        }
    }
    request.send();
}

function loadEntreprises() {
    let request = new XMLHttpRequest();
    request.open("GET", "/api/entreprises", true);
    request.onload = function () {
        if (this.status == 200) {
            document.getElementById("entreprises").innerHTML = "";
            let entreprises = JSON.parse(this.responseText);
            for (let e in entreprises) {
                let enter = "";
                enter += "<div class='col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2'>";
                enter += "<div class='ent'><h3 class='ent-name'>" + entreprises[e].name + "</h3>";
                enter += "<div class='ent-body'><p class='ent-disc'>" + entreprises[e].discription + "</p>";
                enter += "<p class='show-more text-primary' data-toggle='collapse' data-target='#detail" + entreprises[e].id + "'>Plus d'info ▼</p>";
                enter += "<div id='detail" + entreprises[e].id + "' class='collapse'><div class='ent-detail'>";
                enter += "<div style='width: 100%; height:150px;'>";
                let adress = entreprises[e].location.replace(/ /g, "+").replace(/,/g, "");
                enter += '<iframe width="100%" height="170" frameborder="0" src="https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q=' + adress + '&z=14&output=embed"></iframe></div>';
                enter += "<p class='text-primary'></p><div class='detail-text'><p style='width: 50%;'>" + entreprises[e].location + "</p>'<p class='text-primary'></p><div class='detail-text'>";
                enter += "<p><span class='text-primary'>" + entreprises[e].deprartments.length + "</span> déprartments</p></div></div>";
                enter += "<p class='show-less text-primary' data-toggle='collapse' data-target='#detail" + entreprises[e].id + "'>Montrer moins ▲</p></div>";
                enter += `</div><button onclick="showDepatements(${entreprises[e].id})" data-toggle="modal" data-target="#showDepatments" type="button" class="btn btn-primary btn-block" style="border-radius: 8px; font-size: .9em; background-color: #5599FF; color: white;">Afficher / ajouter des départements</button></div></div>`;
                document.getElementById("entreprises").innerHTML += enter;
            }
            toggleEffect();
        }
    };
    request.send();
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

function searchSalary(event,input){
    if(event.keyCode === 13){
        window.open('/search/?name='+input.value);
    }
}

function loadSearchResult(){
    let request = new XMLHttpRequest();
    request.open("GET", "/api/search", true);

    request.onload = function () {
        if (this.status == 200) {
            document.getElementById("salaryInfo").innerHTML = "";
            let salaries = JSON.parse(this.responseText);
            document.getElementById("searchFor").innerHTML = salaries[0].name.toUpperCase();
            for(let s in salaries){
                document.getElementById("salaryInfo").innerHTML += '<tr><td>' + salaries[s].matricule + '</td><td>' + salaries[s].entrepriceName + '</td><td>' + salaries[s].departementName + '</td><td>' + salaries[s].name + '</td><td>' + salaries[s].lastName + '</td><td>' + salaries[s].age + '</td><td>' + salaries[s].salaire + '</td></tr>';
            }
        }
    }
    request.send();
}


function addEnt() {
    let request = new XMLHttpRequest();
    request.onload = function () {
        if (this.status == 200) {
            //console.log(this.responseText);
            loadEntreprises();
        }
    };
    const entreprise = {
        name: document.getElementById("nomEnt").value,
        discription: document.getElementById("discEntr").value,
        location: document.getElementById("locEnt").value,
        deprartments: []
    };
    const formData = JSON.stringify(entreprise);

    request.open("POST", "/api/entreprises", true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(formData);
}


function showDepatements(id) {

    let request = new XMLHttpRequest();
    request.open("GET", "/api/entreprises/" + id, true);

    request.onload = function () {
        if (this.status == 200) {
            let entreprise = JSON.parse(this.responseText);
            let deprartments = entreprise.deprartments;
            document.getElementById("entrOfDep").innerHTML = entreprise.name;
            removeClickListeners("showDepBtn");
            document.getElementById("showDepBtn").addEventListener('click', function () {
                AddDepartmentModal(entreprise.id, entreprise.name);
            });
            let rows = "";
            for (let d in deprartments) {
                rows += '<tr><td>' + deprartments[d].id + '</td><td>' + deprartments[d].name + '</td><td><a href="/department/?entId=' + id + '&depId=' + deprartments[d].id + '">plus de info <i class="fa fa-chevron-right" style="font-size:20px;"></i></a></td></tr>';
            }
            document.getElementById("depTable").innerHTML = rows;
        }
    };
    request.send();
}


function AddDepartmentModal(id, name) {
    document.getElementById("EnterpName").innerHTML = name;
    removeClickListeners("addDepBtn");
    document.getElementById("addDepBtn").addEventListener("click", function () {
        addDepartment(id);
    });
}


function addDepartment(id) {
    let request = new XMLHttpRequest();
    request.onload = function () {
        if (this.status == 200) {
            loadEntreprises();
            showDepatements(id)
        }
    };
    const deprartment = {
        name: document.getElementById("nomDep").value,
        chef: document.getElementById("chefDep").value,
        discription: document.getElementById("discDep").value,
        salaries: []
    };
    const formData = JSON.stringify(deprartment);

    request.open("POST", "/api/entreprises/" + id, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(formData);
}

function removeClickListeners(btnId) {
    let old_element = document.getElementById(btnId);
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
}