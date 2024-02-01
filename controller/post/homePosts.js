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
                    let profile = createProfile(jsonData[i].EmailUtente, jsonData[i].Username, jsonData[i].Luogo, jsonData[i].FotoProfilo);
                    let post = createPost(jsonData[i].ID, jsonData[i].Foto, jsonData[i].Username, jsonData[i].Descrizione);
                    let container = document.createElement("div");
                    container.appendChild(profile);
                    container.appendChild(post);
                    home.appendChild(container);

                    let separator = document.createElement("hr");
                    separator.className = "row my-5";
                    home.appendChild(separator);
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

function profileClick(email) {
    // window.location.href = "../../view/html/profile.html?Email=" + email;
}

function createProfile(email, username, location, image) {
    let profile = document.createElement("div");
    profile.className = "d-flex align-items-center mb-4";
    profile.setAttribute("id", email);

    let pfp = document.createElement("img");
    pfp.className = "rounded-circle me-3";
    pfp.setAttribute(
        "src",
        "data:image/jpeg;base64," + image
    );
    pfp.setAttribute("width", 40);
    pfp.setAttribute("height", 40);

    let infoContainer = document.createElement("div");
    let usernameSpace = document.createElement("b");
    let locationSpace = document.createElement("p");
    usernameSpace.innerHTML = username;
    locationSpace.className = "mb-0";
    locationSpace.innerHTML = location;
    infoContainer.appendChild(usernameSpace);
    infoContainer.appendChild(locationSpace);

    profile.appendChild(pfp);
    profile.appendChild(infoContainer);
    profile.onclick = function() {
        profileClick(email);
    }
    return profile;
}

function createPost(id, image, username, caption) {
    let post = document.createElement("div");

    let img = document.createElement("img");
    img.className = "rounded w-100 h-100";
    img.setAttribute(
        "src",
        "data:image/jpeg;base64," + image
    );

    let usernameSpace = document.createElement("strong");
    usernameSpace.innerHTML = username + ": ";
    let captionSpace = document.createElement("span");
    captionSpace.innerHTML = caption;

    let likeButton = document.createElement("button");
    $.ajax({
        url: '../../model/post/checkLike.php',
        type: 'GET',
        dataType: 'json',
        data: {
            'postID': id
        },
        success: function (response) {
            if (response.success) {
                likeButton.className = "bi fs-4 bi-heart-fill border-0 bg-transparent";
            } else {
                likeButton.className = "bi fs-4 bi-heart border-0 bg-transparent";
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
            likeButton.className = "bi fs-4 bi-heart border-0 bg-transparent";
        }
    });
    likeButton.setAttribute("type", "button");
    likeButton.addEventListener("click", function () {
        if (likeButton.className === "bi fs-4 bi-heart border-0 bg-transparent") {
            $.ajax({
                url: '../../model/post/addLike.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    'postID': id
                },
                success: function (response) {
                    if (response.success) {
                        likeButton.className = "bi fs-4 bi-heart-fill border-0 bg-transparent";
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
                url: '../../model/post/removeLike.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    'postID': id
                },
                success: function (response) {
                    if (response.success) {
                        likeButton.className = "bi fs-4 bi-heart border-0 bg-transparent";
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

    let bookmarkButton = document.createElement("button");
    $.ajax({
        url: '../../model/post/checkBookmark.php',
        type: 'GET',
        dataType: 'json',
        data: {
            'postID': id
        },
        success: function (response) {
            if (response.success) {
                bookmarkButton.className = "bi fs-4 bi-bookmark-fill border-0 bg-transparent";
            } else {
                bookmarkButton.className = "bi fs-4 bi-bookmark border-0 bg-transparent";
            }
            console.log(response.success);
        },
        error: function (error) {
            console.error('Ajax error: ', error);
            bookmarkButton.className = "bi fs-4 bi-bookmark border-0 bg-transparent";
        }
    });
    bookmarkButton.setAttribute("type", "button");
    bookmarkButton.addEventListener("click", function () {
        if (bookmarkButton.className === "bi fs-4 bi-bookmark border-0 bg-transparent") {
            $.ajax({
                url: '../../model/post/addBookmark.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    'postID': id
                },
                success: function (response) {
                    if (response.success) {
                        bookmarkButton.className = "bi fs-4 bi-bookmark-fill border-0 bg-transparent";
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
                url: '../../model/post/removeBookmark.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    'postID': id
                },
                success: function (response) {
                    if (response.success) {
                        bookmarkButton.className = "bi fs-4 bi-bookmark border-0 bg-transparent";
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

    let commentButton = document.createElement("button");
    commentButton.className = "bi fs-4 bi-chat border-0 bg-transparent";
    commentButton.setAttribute("type", "button");
    commentButton.addEventListener("click", function () {
        // TODO: commenti
    });

    let buttonsContainer = document.createElement("div");
    buttonsContainer.className = "col-3 d-flex justify-content-end";
    buttonsContainer.appendChild(commentButton);
    buttonsContainer.appendChild(likeButton);
    buttonsContainer.appendChild(bookmarkButton);

    let captionContainer = document.createElement("p");
    captionContainer.className = "col-9 mb-2";
    captionContainer.appendChild(usernameSpace);
    captionContainer.appendChild(captionSpace);

    let tmp = document.createElement("div");
    tmp.className = "row";
    tmp.appendChild(captionContainer);
    tmp.appendChild(buttonsContainer);

    let showComment = document.createElement("a");
    showComment.className = "comment";
    showComment.innerHTML = "Mostra tutti i commenti...";

    post.appendChild(img);
    post.appendChild(tmp);
    post.appendChild(showComment);

    return post;
}