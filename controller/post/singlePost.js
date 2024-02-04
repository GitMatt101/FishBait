const href = window.location.search;
const idPost = href.substring(href.indexOf("=") + 1);

$.ajax({
    url: '../../model/post/getPostInfo.php',
    type: 'GET',
    dataType: 'json',
    data: {
        'idPost': idPost
    },
    success: function (response) {
        if (response.postData[0].Email != sessionStorage.getItem("userEmail")) {
            if (response.success) { 
                const email = response.postData[0].Email;
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
                                    addNotification(email, "null", "ha iniziato a seguirti");
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
                });
                document.getElementById("follow-button-space").appendChild(followButton);
            } else {
                console.log(response.error);
            }
        }
    },
    error: function (error) {
        console.error('Ajax error: ', error);
    }
});

document.getElementById("comment-btn").onclick = function () {
    let comment = document.getElementById("input-comment").value;
    $.ajax({
        url: '../../model/post/addComment.php',
        type: 'POST',
        dataType: 'json',
        data: {
            'idPost': idPost,
            'contenuto': comment
        },
        success: function (response) {
            if (response.success) {
                $.ajax({
                    url: '../../model/post/getPostInfo.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        'idPost': idPost
                    },
                    success: function (response) {
                        if (response.success && response.postData[0].Email != sessionStorage.getItem("userEmail")) {
                            addNotification(response.postData[0].Email, idPost, "ha commentato il tuo post");
                        } else {
                            console.log(response.error);
                        }
                    },
                    error: function (error) {
                        console.error('Ajax error: ', error);
                    }
                });
                window.location.reload();
            } else {
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

window.addEventListener("load", function () {
    // Visualizza il post
    $.ajax({
        url: '../../model/post/getPostInfo.php',
        type: 'GET',
        dataType: 'json',
        data: {
            'idPost': idPost
        },
        success: function (response) {
            if (response.success) {
                const jsonData = response.postData[0];

                let profile = document.getElementById("profilo");
                profile.onclick = function () {
                    window.location.href = "../../view/html/profile.html?email=" + jsonData.Email;
                }

                let pfp = document.getElementById("foto");
                pfp.className = "rounded-circle me-3";
                if (jsonData.FotoProfilo) { 
                    pfp.setAttribute("src", "data:image/jpeg;base64," +  jsonData.FotoProfilo);
                } else {
                    pfp.setAttribute("src", "../../resources/img/place-holder-pfp.jpg");
                }
                pfp.setAttribute("alt", "");
                pfp.setAttribute("width", 60);
                pfp.setAttribute("height", 60);

                document.getElementById("autore").innerHTML = jsonData.Username;
                document.getElementById("luogo").innerHTML = jsonData.Luogo;
                document.getElementById("descrizione").innerHTML = jsonData.Descrizione;

                let img = document.getElementById("post-img");
                img.className = "img-fluid rounded w-100";
                img.setAttribute(
                    "src",
                    "data:image/jpeg;base64," + jsonData.Foto
                );

                let likeButton = createButton("bi me-0 p-0 fs-4 bi-heart border-0 bg-transparent",
                    "bi me-0 p-0 fs-4 bi-heart-fill border-0 bg-transparent",
                    "../../model/post/checkLike.php",
                    "../../model/post/addLike.php",
                    "../../model/post/removeLike.php",
                    idPost,
                    jsonData.Email,
                    "ha messo mi piace al tuo post");
                let likeContainer = document.createElement("div");
                likeContainer.className = "d-flex align-items-end";
                likeContainer.appendChild(likeButton);
                let numLikes = document.createElement("span");
                numLikes.innerHTML = jsonData.NumLikes;
                numLikes.className = "fs-6";
                likeContainer.appendChild(likeButton);
                likeContainer.appendChild(numLikes);
                
                let bookmarkButton = createButton("bi me-0 p-0 fs-4 bi-bookmark border-0 bg-transparent",
                    "bi me-0 p-0 fs-4 bi-bookmark-fill border-0 bg-transparent",
                    "../../model/post/checkBookmark.php",
                    "../../model/post/addBookmark.php",
                    "../../model/post/removeBookmark.php",
                    idPost,
                    jsonData.Email,
                    null);
                let bookmarkContainer = document.createElement("div");
                bookmarkContainer.className = "d-flex align-items-end";
                bookmarkContainer.appendChild(bookmarkButton);

                if (jsonData.Email != sessionStorage.getItem("userEmail")) {
                    document.getElementById("button-container").appendChild(bookmarkContainer);
                } else {
                    likeButton.disabled = true;
                }
                document.getElementById("button-container").appendChild(likeContainer);
            } else {
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });

    // Visualizza i commenti
    $.ajax({
        url: '../../model/post/getComment.php',
        type: 'GET',
        dataType: 'json',
        data: {
            postID: idPost,
        },
        success: function (response) {
            if (response.success) {
                const jsonData = response.commenti;
                const listBox = document.getElementById("comment-section");
                listBox.innerHTML = "";
                for (let i = 0; i < jsonData.length; i++) {
                    let pfp = document.createElement("img");
                    pfp.className = "rounded-circle me-3";
                    if (jsonData[i].FotoProfilo) { 
                        pfp.setAttribute("src", "data:image/jpeg;base64," +  jsonData[i].FotoProfilo);
                    } else {
                        pfp.setAttribute("src", "../../resources/img/place-holder-pfp.jpg");
                    }
                    pfp.setAttribute("alt", "");
                    pfp.setAttribute("width", 40);
                    pfp.setAttribute("height", 40);
                    let username = document.createElement("b");
                    let container = document.createElement("div");
                    let contenuto = document.createElement("span");
                    contenuto.className = "text-start";
                    container.className = "d-flex";
                    contenuto.innerHTML = jsonData[i].Contenuto;
                    username.innerHTML = jsonData[i].Username + ": ";

                    let contentContainer = document.createElement("div");
                    contentContainer.className = "row justify-content-center text-start";
                    contentContainer.appendChild(username);
                    contentContainer.appendChild(contenuto);

                    let userContainer = document.createElement("div");
                    userContainer.className = "btn d-flex col-12 align-items-center";
                    userContainer.onclick = function () {
                        window.location.href = "../../view/html/profile.html?email=" + jsonData[i].Email;
                    }
                    userContainer.appendChild(pfp);
                    userContainer.appendChild(contentContainer);

                    container.appendChild(userContainer);
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


function createButton(empty, fill, checkPath, addPath, removePath, postID, email, message) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    // Verifica se il pulsante va attivato (like/bookmark già messo)
    $.ajax({
        url: checkPath,
        type: 'GET',
        dataType: 'json',
        data: {
            'postID': postID
        },
        success: function (response) {
            if (response.success) {
                button.className = fill;
            } else {
                button.className = empty;
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
            button.className = empty;
        }
    });
    button.addEventListener("click", function () {
        if (button.className == empty) {
            executeAction(email, postID, message, fill, addPath, button);
        } else {
            executeAction(email, postID, null, empty, removePath, button);
        }
    });
    return button;
}

function executeAction(email, id, message, className, path, button) {
    $.ajax({
        url: path,
        type: 'GET',
        dataType: 'json',
        data: {
            'postID': id
        },
        success: function (response) {
            if (response.success) {
                button.className = className;
                window.location.reload();
                if (message != null) {
                    addNotification(email, id, message);
                }
            } else {
                console.log("Errore: ", response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}

function addNotification(email, idPost, message) {
    $.ajax({
        url: '../../model/user/addNotification.php',
        type: 'POST',
        dataType: 'json',
        data: {
            'emailRicevente': email,
            'idPost': idPost,
            'descrizione': message
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