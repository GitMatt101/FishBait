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
                    pfp.className = "rounded-circle me-3";
                    pfp.setAttribute(
                        "src",
                        "data:image/jpeg;base64," +  jsonData[i].FotoProfilo
                    );
                    pfp.setAttribute("width", 60);
                    pfp.setAttribute("height", 60);
                    let username = document.createElement("b");
                    username.innerHTML = jsonData[i].Username;
                    let message = document.createElement("span");
                    message.className = "ms-2";
                    message.innerHTML = jsonData[i].Descrizione;

                    let mainContainer = document.createElement("div");
                    mainContainer.className = "row mb-4";
                    let row = document.createElement("div");
                    row.className = "d-flex justify-content-between align-items-center alignt-text-center";
                    let userContainer = document.createElement("div");
                    userContainer.className = "col-8 d-flex align-items-center";
                    userContainer.appendChild(pfp);
                    userContainer.appendChild(username);
                    userContainer.appendChild(message);
                    userContainer.addEventListener("click", function () {
                        if (jsonData[i].IDPost != null) {
                            window.location.href = "../../view/html/post.html?id=" + jsonData[i].IDPost;
                        } else {
                            window.location.href = "../../view/html/profile.html?email=" + jsonData[i].Email;
                        }
                    });
                    row.appendChild(userContainer);
                    row.appendChild(createFollowButton(jsonData[i].Email));
                    mainContainer.appendChild(row);
                    notifications.appendChild(mainContainer);
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
                        addFollowNotification(email, null, "ha iniziato a seguirti");
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
    tmp.className = "col-2 row align-items-center";
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