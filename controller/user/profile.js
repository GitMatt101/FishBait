window.addEventListener("load", function () {

    // Prendo la mail dell'account che voglio visualizzare
    var href = window.location.search;
    var email = href.substring(href.indexOf("=") + 1);
    if (email == "") {
        email = this.sessionStorage.getItem("userEmail");
        window.location.href = "../../view/html/profile.html?email=" + email;
    }

    // Controllo se il profilo visualizzzato è quello dell'utente loggato per attivare il pulsante di logout
    if (email != this.sessionStorage.getItem("userEmail")) {
        document.getElementById("logout").style.display = "none";
    }

    // Dati dell'utente
    $.ajax({
        url: '../../model/user/getUserInfo.php',
        type: 'GET',
        dataType: 'json',
        data: {
            userEmail: email
        },
        success: function (response) {
            if (response.success) {
                let userData = response.userData[0];
                $("#user-username").text(userData.Username);
                $("#user-name").text(userData.Nome + " " + userData.Cognome);
                $("#user-bio").text(userData.Descrizione);
                $("#user-birth").text(" Nato il : " + userData.DataNascita);
                if (userData.FotoProfilo) {
                    $("#user-photo").attr("src", "data:image/jpeg;base64," + userData.FotoProfilo);
                } else {
                    $("#user-photo").attr("src", "../../resources/img/place-holder-pfp.jpg");
                }
                document.getElementById("seguiti").innerHTML = response.followingCount;
                document.getElementById("followers").innerHTML = response.followersCount;
                document.getElementById("post").innerHTML = response.postCount;
            } else {
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });

    // Seguiti e followers
    const btnSeguiti = document.getElementById("n-seguiti");
    const btnFollowers = document.getElementById("n-followers");

    btnSeguiti.addEventListener("click", function () {
        $.ajax({
            url: '../../model/user/getSeguiti.php',
            type: 'GET',
            dataType: 'json',
            data: {
                userEmail: email
            },
            success: function (response) {
                if (response.success) {
                    const jsonData = response.utenti;
                    const listBox = document.getElementById("listSeguiti");
                    listBox.innerHTML = "";
                    for (let i = 0; i < jsonData.length; i++) {
                        let pfp = document.createElement("img");
                        pfp.className = "rounded-circle me-3";
                        pfp.setAttribute(
                            "src",
                            "data:image/jpeg;base64," +  jsonData[i].FotoProfilo
                        );
                        pfp.setAttribute("width", 60);
                        pfp.setAttribute("height", 60);
                        let username = document.createElement("b");
                        let container = document.createElement("div");
                        container.className = "d-flex";
                        username.innerHTML = jsonData[i].Username;

                        let userContainer = document.createElement("div");
                        userContainer.className = "btn d-flex col-9 align-items-center me-3";
                        userContainer.onclick = function() {
                            window.location.href = "../../view/html/profile.html?email=" + jsonData[i].Email;
                        }
                        userContainer.appendChild(pfp);
                        userContainer.appendChild(username);

                        container.appendChild(userContainer);
                        if (jsonData[i].Email != sessionStorage.getItem("userEmail")) {
                            container.appendChild(createFollowButton(jsonData[i].Email));
                        }
                        listBox.appendChild(container);
                    }
                } else {
                    console.log("Errore: ", response.error);
                }
            },
            error: function (error) {
                console.error('Ajax error: ', error);
            }
        });
    });

    btnFollowers.addEventListener("click", function () {
        $.ajax({
            url: '../../model/user/getFollowers.php',
            type: 'GET',
            dataType: 'json',
            data: {
                userEmail: email
            },
            success: function (response) {
                if (response.success) {
                    const jsonData = response.followers;
                    const listBox = document.getElementById("listFollowers");
                    listBox.innerHTML = "";
                    for (let i = 0; i < jsonData.length; i++) {
                        let pfp = document.createElement("img");
                        pfp.className = "rounded-circle me-3";
                        pfp.setAttribute(
                            "src",
                            "data:image/jpeg;base64," +  jsonData[i].FotoProfilo
                        );
                        pfp.setAttribute("width", 60);
                        pfp.setAttribute("height", 60);
                        let username = document.createElement("b");
                        let container = document.createElement("div");
                        container.className = "d-flex";
                        username.innerHTML = jsonData[i].Username;

                        let userContainer = document.createElement("div");
                        userContainer.className = "btn d-flex col-9 align-items-center me-3";
                        userContainer.onclick = function() {
                            window.location.href = "../../view/html/profile.html?email=" + jsonData[i].Email;
                        }
                        userContainer.appendChild(pfp);
                        userContainer.appendChild(username);

                        container.appendChild(userContainer);
                        if (jsonData[i].Email != sessionStorage.getItem("userEmail")) {
                            container.appendChild(createFollowButton(jsonData[i].Email));
                        }
                        listBox.appendChild(container);
                    }
                } else {
                    console.log("Errore: ", response.error);
                }
            },
            error: function (error) {
                console.error('Ajax error: ', error);
            }
        });
    });

    // Post dell'utente
    $.ajax({
        url: '../../model/user/userPosts.php',
        type: 'GET',
        dataType: 'json',
        data: {
            userEmail: email
        },
        success: function (response) {
            if (response.success) {
                const jsonData = response.posts;
                let postSpace = document.getElementById("post-space");
                for (let i = 0; i < jsonData.length; i++) {
                    let element = document.createElement("div");
                    element.className = "col-4 mb-2 d-flex flex-wrap align-items-center";
                    element.setAttribute("id", jsonData[i].ID);

                    let image = document.createElement("img");
                    image.className = "img-fluid";
                    image.setAttribute(
                      "src",
                      "data:image/jpeg;base64," + jsonData[i].Foto
                    );
                    element.appendChild(image);
                    element.onclick = function() {
                        click(jsonData[i].ID);
                    }
                    postSpace.appendChild(element);
                  }
            } else {
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
});

function click(id) {
    // window.location.href = "../../view/html/post.html?id=" + id;
}

function createFollowButton(email) {
    let followButton = document.createElement("button");
    followButton.setAttribute("type", "button");
    $.ajax({
        url: '../../model/user/checkFollow.php',
        type: 'GET',
        dataType: 'json',
        data: {
            'emailSeguito': email
        },
        success: function (response) {
            if (response.success) {
                followButton.className = "btn btn-outline-primary";
                followButton.innerHTML = "Segui già";
            } else {
                followButton.className = "btn btn-primary";
                followButton.innerHTML = "Segui";
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
            followButton.className = "btn btn-primary";
        }
    });
    followButton.addEventListener("click", function () {
        if (followButton.className === "btn btn-primary") {
            $.ajax({
                url: '../../model/user/addFollow.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    'emailSeguito': email
                },
                success: function (response) {
                    if (response.success) {
                        followButton.className = "btn btn-outline-primary";
                        followButton.innerHTML = "Segui già";
                    } else {
                        console.log("Errore: ", response.error);
                    }
                },
                error: function (error) {
                    console.error('Ajax error: ', error);
                }
            });
        } else {
            $.ajax({
                url: '../../model/user/removeFollow.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    'emailSeguito': email
                },
                success: function (response) {
                    if (response.success) {
                        followButton.className = "btn btn-primary";
                        followButton.innerHTML = "Segui";
                    } else {
                        console.log("Errore: ", response.error);
                    }
                },
                error: function (error) {
                    console.error('Ajax error: ', error);
                }
            });
        }
    });
    let tmp = document.createElement("div");
    tmp.className = "col-3 row align-items-center";
    tmp.appendChild(followButton);
    return tmp;
}