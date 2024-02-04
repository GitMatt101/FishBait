window.addEventListener('load', function () {
    $.ajax({
        url: '../../model/user/getNotifications.php',
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            if (response.success) {
                const jsonData = response.notifications;
                const notifications = document.getElementById("notifiche");
                notifications.innerHTML = "";
                for (let i = 0; i < jsonData.length; i++) {
                    let pfp = document.createElement("img");
                    pfp.className = "rounded-circle m-0 p-0 border border-2 border-dark";
                    if (jsonData[i].FotoProfilo) {
                        pfp.setAttribute("src", "data:image/jpeg;base64," +  jsonData[i].FotoProfilo);
                    } else {
                        pfp.setAttribute("src", "../../resources/img/place-holder-pfp.jpg");
                    }
                    pfp.setAttribute("alt", "");
                    pfp.setAttribute("width", 60);
                    pfp.setAttribute("height", 60);
                    let username = document.createElement("b");
                    username.innerHTML = jsonData[i].Username;
                    let message = document.createElement("span");
                    message.className = "text-start";
                    message.innerHTML = jsonData[i].Descrizione;

                    let mainContainer = document.createElement("div");
                    mainContainer.className = "row mb-4";
                    let row = document.createElement("div");
                    row.className = "d-flex justify-content-between align-items-center";
                    let userContainer = document.createElement("div");
                    userContainer.className = "btn d-flex col-9 align-items-center p-0 mb-2";
                    let pfpContainer = document.createElement("div");
                    pfpContainer.className = "d-flex align-items-start me-2";
                    pfpContainer.appendChild(pfp);
                    
                    let messageContainer = document.createElement("div");
                    messageContainer.className = "row justify-content-center text-start";
                    messageContainer.appendChild(username);
                    messageContainer.appendChild(message);
                    userContainer.onclick = function () {
                        if (jsonData[i].IDPost != null) {
                            window.location.href = "../../view/html/post.html?id=" + jsonData[i].IDPost;
                        } else {
                            window.location.href = "../../view/html/profile.html?email=" + jsonData[i].Email;
                        }
                    }
                    row.appendChild(userContainer);
                    userContainer.appendChild(messageContainer);
                    row.appendChild(createFollowButton(jsonData[i].Email));
                    if (!jsonData[i].Visualizzato) {
                        let dot = document.createElement("span");
                        dot.className = "badge rounded-pill badge-dot bg-danger m-0 p-1";
                        dot.innerHTML = " ";
                        pfpContainer.appendChild(dot);
                        setNotificationAsRead(jsonData[i].IDNotifica);
                    }
                    userContainer.appendChild(pfpContainer);
                    userContainer.appendChild(messageContainer);
                    mainContainer.appendChild(row);
                    notifications.appendChild(mainContainer);
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

function setNotificationAsRead(idNotifica) {
    $.ajax({
        url: '../../model/user/setNotificationAsRead.php',
        type: 'GET',
        dataType: 'json',
        data: {
            'idNotifica': idNotifica
        },
        success: function (response) {
            if (!response.success) {
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
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
                        addFollowNotification(email, null, "ha iniziato a seguirti");
                        window.location.reload();
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
                        window.location.reload();
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
                console.log(response.idp);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}