/*jshint esversion: 6 */
$(document).ready(function () {
    $("#show").click(function () {
        $(this).hide(200);
        $("#hide").show(200);
    });
    $("#hide").click(function () {
        $(this).hide(200);
        $("#show").show(200);
    });
    loadEntreprises();
});

function loadEntreprises() {
    let request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3000/api/entreprises", true);
    request.onload = function () {
        if (this.status == 200) {
            document.getElementById("entreprises").innerHTML = "";
            let entreprises = JSON.parse(this.responseText);
            for (let e in entreprises) {
                let enter = "";
                enter += "<div class='col-xs-12 col-sm-6 col-md-4 col-lg-3 my-2'>";
                enter += "<div class='ent'><h3 class='ent-name'>" + entreprises[e].name + "</h3>";
                enter += "<div class='ent-body'><p class='ent-disc'>" + entreprises[e].discription + "</p>";
                enter += "<p id='show' class='text-primary show-more' data-toggle='collapse' data-target='#detail" + entreprises[e].id + "'>Plus d'info ▼</p>";
                enter += "<div id='detail" + entreprises[e].id + "' class='collapse'><div class='ent-detail'><div class='map'>";
                enter += "<iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3297.581679627881!2d-6.586231385013859!3d34.259216414242374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda759e405b8c3a1%3A0x9be254e43555ea5f!2sKenitra%20mall!5e0!3m2!1sen!2sma!4v1585410711027!5m2!1sen!2sma' width='100%' height='100%' frameborder='0' style='border:0;' allowfullscreen='' aria-hidden='false' tabindex='0'></iframe></div>";
                enter += "<p class='text-primary'></p><div class='detail-text'><p>" + entreprises[e].location + "</p>'<p class='text-primary'></p><div class='detail-text'>";
                enter += "<p><span class='text-primary'>" + entreprises[e].deprartments.length + "</span> déprartments</p></div></div>";
                enter += "<p id='hide' class='text-primary show-more' data-toggle='collapse' data-target='#detail" + entreprises[e].id + "'>Montrer moins ▲</p></div>";
                enter += `</div><button onclick="showDepatements(${entreprises[e].id})" data-toggle="modal" data-target="#showDepatments" type="button" class="btn btn-primary btn-block" style="border-radius: 8px; font-size: .9em; background-color: #5599FF; color: white;">Afficher / ajouter des départements</button></div></div>`;
                document.getElementById("entreprises").innerHTML += enter;
                //modalAddDep(${entreprises[e].id}, '${entreprises[e].name}')
            }
        }
    };
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

    request.open("POST", "http://localhost:3000/api/entreprises", true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(formData);
}


function showDepatements(id) {

    let request = new XMLHttpRequest();
    request.open("GET", "http://localhost:3000/api/entreprises/" + id, true);

    request.onload = function () {
        if (this.status == 200) {
            let entreprise = JSON.parse(this.responseText);
            let deprartments = entreprise.deprartments;
            document.getElementById("entrOfDep").innerHTML = entreprise.name;
            removeClickListeners("showDepBtn");
            document.getElementById("showDepBtn").addEventListener('click', function(){
                AddDepartmentModal(entreprise.id, entreprise.name);
            });
            let rows = "";
            for (let d in deprartments) {
                rows += '<tr><td>' + deprartments[d].id + '</td><td>' + deprartments[d].name + '</td></tr>';
            }
            document.getElementById("depTable").innerHTML = rows;
        }
    };
    request.send();
}


function AddDepartmentModal(id, name) {
    document.getElementById("EnterpName").innerHTML = name;
    removeClickListeners("addDepBtn");
    document.getElementById("addDepBtn").addEventListener("click", function(){
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

    request.open("POST", "http://localhost:3000/api/entreprises/" + id, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(formData);
}

function removeClickListeners(btnId){
    let old_element = document.getElementById(btnId);
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
}