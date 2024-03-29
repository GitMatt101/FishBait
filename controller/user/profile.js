window.addEventListener("load", function () {

    // Prendo la mail dell'account che voglio visualizzare
    let href = window.location.search;
    let email = href.substring(href.indexOf("=") + 1);
    if (email == "") {
        email = this.sessionStorage.getItem("userEmail");
        window.location.href = "../../view/html/profile.html?email=" + email;
    }

    // Controllo se il profilo visualizzzato è quello dell'utente loggato per attivare il pulsante di logout o segui
    if (email != this.sessionStorage.getItem("userEmail")) {
        document.getElementById("logout").style.display = "none";
        document.getElementById("edit").style.display = "none";
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
                    followButton.className = "btn btn-sm btn-outline-primary p-1";
                    followButton.innerHTML = "Segui già";
                } else {
                    followButton.className = "btn btn-sm btn-primary p-1";
                    followButton.innerHTML = "Segui";
                }
            },
            error: function (error) {
                console.error('Ajax error: ', error);
                followButton.className = "btn btn-sm btn-primary p-1";
            }
        });
        followButton.addEventListener("click", function () {
            if (followButton.className === "btn btn-sm btn-primary p-1") {
                $.ajax({
                    url: '../../model/user/addFollow.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        'emailSeguito': email
                    },
                    success: function (response) {
                        if (response.success) {
                            followButton.className = "btn btn-sm btn-outline-primary p-1";
                            followButton.innerHTML = "Segui già";
                            // Crea la notifica di follow
                            $.ajax({
                                url: '../../model/user/addNotification.php',
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    'emailRicevente': email,
                                    'idPost': null,
                                    'descrizione': "ha cominciato a seguirti"
                                },
                                success: function (response) {
                                    if (!response.success) {
                                        console.log("Errore: ", response.error);
                                    }
                                },
                                error: function (error) {
                                    console.error('Ajax error: ', error);
                                }
                            });
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
                            followButton.className = "btn btn-sm btn-primary p-1";
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
            window.location.reload();
        });
        document.getElementById("button-space").appendChild(followButton);
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
                if (!response.login) {
                    window.location.href = "../../view/html/login.html";
                }
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
                        pfp.className = "rounded-circle me-2";
                        if (jsonData[i].FotoProfilo) { 
                            pfp.setAttribute("src", "data:image/jpeg;base64," +  jsonData[i].FotoProfilo);
                        } else {
                            pfp.setAttribute("src", "../../resources/img/place-holder-pfp.jpg");
                        }
                        pfp.setAttribute("alt", "");
                        pfp.setAttribute("width", 50);
                        pfp.setAttribute("height", 50);
                        let username = document.createElement("strong");
                        let container = document.createElement("div");
                        container.className = "d-flex";
                        username.innerHTML = jsonData[i].Username;

                        let userContainer = document.createElement("div");
                        userContainer.className = "btn col-9 d-flex align-items-center mb-2 p-0";
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
                    if (!response.login) {
                        window.location.href = "../../view/html/login.html";
                    }
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
                        pfp.className = "rounded-circle me-2";
                        if (jsonData[i].FotoProfilo) { 
                            pfp.setAttribute("src", "data:image/jpeg;base64," +  jsonData[i].FotoProfilo);
                        } else {
                            pfp.setAttribute("src", "../../resources/img/place-holder-pfp.jpg");
                        }
                        pfp.setAttribute("alt", "");
                        pfp.setAttribute("width", 50);
                        pfp.setAttribute("height", 50);
                        let username = document.createElement("strong");
                        let container = document.createElement("div");
                        container.className = "d-flex";
                        username.innerHTML = jsonData[i].Username;

                        let userContainer = document.createElement("div");
                        userContainer.className = "btn d-flex col-9 align-items-center p-0 mb-2";
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
                    if (!response.login) {
                        window.location.href = "../../view/html/login.html";
                    }
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
                    image.setAttribute("alt", "");
                    element.appendChild(image);
                    element.onclick = function() {
                        window.location.href = "../../view/html/post.html?id=" + jsonData[i].ID;
                    }
                    postSpace.appendChild(element);
                  }
            } else {
                if (!response.login) {
                    window.location.href = "../../view/html/login.html";
                }
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
});

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
                followButton.className = "btn btn-outline-primary p-1";
                followButton.innerHTML = "Segui già";
            } else {
                followButton.className = "btn btn-primary p-1";
                followButton.innerHTML = "Segui";
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
            followButton.className = "btn btn-primary p-1";
        }
    });
    followButton.addEventListener("click", function () {
        if (followButton.className === "btn btn-primary p-1") {
            $.ajax({
                url: '../../model/user/addFollow.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    'emailSeguito': email
                },
                success: function (response) {
                    if (response.success) {
                        followButton.className = "btn btn-outline-primary p-1";
                        followButton.innerHTML = "Segui già";
                        addFollowNotification(email, "null", "ha iniziato a seguirti");
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
                        followButton.className = "btn btn-primary p-1";
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

function addFollowNotification (email, idPost, descrizione) {
    $.ajax({
        url: '../../model/user/addNotification.php',
        type: 'POST',
        dataType: 'json',
        data: {
            'emailRicevente': email,
            'idPost': idPost,
            'descrizione': descrizione
        },
        success: function (response) {
            if (!response.success) {
                console.log("Errore: ", response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}