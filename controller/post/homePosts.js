window.addEventListener("load", function () {
    // Post della home
    $.ajax({
        url: '../../model/post/homePosts.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const jsonData = response.posts;
                let home = document.getElementById("home");
                for (let i = 0; i < jsonData.length; i++) {
                    let profile = createProfile(jsonData[i].Email, jsonData[i].Username, jsonData[i].Luogo, jsonData[i].FotoProfilo);
                    let post = createPost(jsonData[i].ID, jsonData[i].Email, jsonData[i].Foto, jsonData[i].Username, jsonData[i].Descrizione, jsonData[i].NumLikes, jsonData[i].NumCommenti);
                    let container = document.createElement("div");
                    container.appendChild(profile);
                    container.appendChild(post);
                    home.appendChild(container);

                    let separator = document.createElement("hr");
                    separator.className = "row mt-2";
                    home.appendChild(separator);
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

function createProfile(email, username, location, image) {
    let profile = document.createElement("div");
    profile.className = "d-flex";
    profile.setAttribute("id", email);

    let pfp = document.createElement("img");
    pfp.className = "rounded-circle me-3";
    if (image) { 
        pfp.setAttribute("src", "data:image/jpeg;base64," +  image);
    } else {
        pfp.setAttribute("src", "../../resources/img/place-holder-pfp.jpg");
    }
    pfp.setAttribute("alt", "");
    pfp.setAttribute("width", 50);
    pfp.setAttribute("height", 50);

    let infoContainer = document.createElement("div");
    let usernameSpace = document.createElement("strong");
    let locationSpace = document.createElement("span");
    usernameSpace.innerHTML = username;
    locationSpace.className = "mb-0";
    locationSpace.innerHTML = location;
    infoContainer.className = "row justify-content-center text-start";
    infoContainer.appendChild(usernameSpace);
    infoContainer.appendChild(locationSpace);

    let profileContainer = document.createElement("div");
    profileContainer.className = "btn d-flex col-9";
    profileContainer.appendChild(pfp);
    profileContainer.appendChild(infoContainer);
    profileContainer.onclick = function() {
        window.location.href = "../../view/html/profile.html?email=" + email;
    }

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
    tmp.className = "col-3 row align-items-center p-0";
    tmp.appendChild(followButton);

    profile.appendChild(profileContainer);
    profile.appendChild(tmp);
    return profile;
}

function createPost(id, email, image, username, caption, likes, comments) {
    let post = document.createElement("div");

    let img = document.createElement("img");
    img.className = "rounded w-100 h-100";
    img.setAttribute(
        "src",
        "data:image/jpeg;base64," + image
    );
    img.setAttribute("alt", "");

    let likeButton = createButton("bi me-0 p-0 fs-4 bi-heart border-0 bg-transparent", 
        "bi me-0 p-0 fs-4 bi-heart-fill border-0 bg-transparent", 
        "../../model/post/checkLike.php", 
        "../../model/post/addLike.php", 
        "../../model/post/removeLike.php", 
        id, 
        email,
        "ha messo mi piace al tuo post");
    let likeContainer = document.createElement("div");
    likeContainer.className = "d-flex align-items-end me-1";
    likeContainer.appendChild(likeButton);
    let numLikes = document.createElement("span");
    numLikes.innerHTML = likes;
    numLikes.className = "fs-6";
    likeContainer.appendChild(likeButton);
    likeContainer.appendChild(numLikes);

    let bookmarkButton = createButton("bi me-0 p-0 fs-4 bi-bookmark border-0 bg-transparent",
        "bi me-0 p-0 fs-4 bi-bookmark-fill border-0 bg-transparent",
        "../../model/post/checkBookmark.php",
        "../../model/post/addBookmark.php",
        "../../model/post/removeBookmark.php",
        id,
        email,
        null);

    let commentButton = document.createElement("button");
    commentButton.className = "me-0 p-0 bi fs-4 bi-chat border-0 bg-transparent";
    commentButton.setAttribute("type", "button");
    commentButton.addEventListener("click", function () {
        window.location.href = "../../view/html/post.html?id=" + id;
    });
    let commentContainer = document.createElement("div");
    commentContainer.className = "d-flex align-items-end me-1";
    commentContainer.appendChild(commentButton);
    let numComments = document.createElement("span");
    numComments.innerHTML = comments;
    numComments.className = "fs-6";
    commentContainer.appendChild(commentButton);
    commentContainer.appendChild(numComments);

    let bookmarkContainer = document.createElement("div");
    bookmarkContainer.className = "d-flex align-items-end me-1";
    bookmarkContainer.appendChild(bookmarkButton);

    let buttonsContainer = document.createElement("div");
    buttonsContainer.className = "col-3 d-flex justify-content-end";
    buttonsContainer.appendChild(commentContainer);
    buttonsContainer.appendChild(likeContainer);
    buttonsContainer.appendChild(bookmarkContainer);

    let captionContainer = document.createElement("div");
    captionContainer.className = "col-9 d-flex align-items-center";
    let captionSpace = document.createElement("span");
    captionSpace.className = "text-wrap ms-1";
    captionSpace.innerHTML = caption;
    captionContainer.appendChild(captionSpace);

    let tmp = document.createElement("div");
    tmp.className = "row";
    tmp.appendChild(captionContainer);
    tmp.appendChild(buttonsContainer);

    post.appendChild(img);
    post.appendChild(tmp);

    return post;
}

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