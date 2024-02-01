document.getElementById("comment-btn").onclick = function () {
    let comment = document.getElementById("comment-input").value;
    // addComment(comment);
}

window.addEventListener("load", function () {

    let href = window.location.search;
    let idPost = href.substring(href.indexOf("=") + 1);

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

                let pfp = document.getElementById("foto");
                pfp.className = "rounded-circle me-3";
                pfp.setAttribute(
                    "src",
                    "data:image/jpeg;base64," +  jsonData.FotoProfilo
                );
                pfp.setAttribute("width", 60);
                pfp.setAttribute("height", 60);

                document.getElementById("autore").innerHTML = jsonData.Username;
                document.getElementById("luogo").innerHTML = jsonData.Luogo;
                document.getElementById("autore-descrizione").innerHTML = jsonData.Username;
                document.getElementById("descrizione").innerHTML = jsonData.Descrizione;

                let img = document.getElementById("post-img");
                img.className = "img-fluid rounded";
                img.setAttribute(
                    "src",
                    "data:image/jpeg;base64," + jsonData.Foto
                );

                let likeButton = createButton("bi fs-4 bi-heart border-0 bg-transparent", 
                    "bi fs-4 bi-heart-fill border-0 bg-transparent", 
                    "../../model/post/checkLike.php", 
                    "../../model/post/addLike.php", 
                    "../../model/post/removeLike.php", 
                    idPost, 
                    jsonData.Email,
                    "ha messo mi piace al tuo post");

                let bookmarkButton = createButton("bi fs-4 bi-bookmark border-0 bg-transparent",
                    "bi fs-4 bi-bookmark-fill border-0 bg-transparent",
                    "../../model/post/checkBookmark.php",
                    "../../model/post/addBookmark.php",
                    "../../model/post/removeBookmark.php",
                    idPost,
                    jsonData.Email,
                    null);
                
                let buttonsContainer = document.getElementById("button-container");
                buttonsContainer.appendChild(likeButton);
                buttonsContainer.appendChild(bookmarkButton);
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
                    pfp.setAttribute(
                        "src",
                        "data:image/jpeg;base64," +  jsonData[i].FotoProfilo
                    );
                    pfp.setAttribute("width", 30);
                    pfp.setAttribute("height", 30);
                    let username = document.createElement("b");
                    let container = document.createElement("div");
                    let contenuto = document.createElement("span");
                    contenuto.className = "ms-2";
                    container.className = "d-flex";
                    contenuto.innerHTML = jsonData[i].Contenuto;
                    username.innerHTML = jsonData[i].Username + ": ";

                    let userContainer = document.createElement("div");
                    userContainer.className = "btn d-flex col-9 align-items-center me-3";
                    userContainer.onclick = function () {
                        window.location.href = "../../view/html/profile.html?email=" + jsonData[i].Email;
                    }
                    userContainer.appendChild(pfp);
                    userContainer.appendChild(username);
                    userContainer.appendChild(contenuto);

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