window.addEventListener("load", function () {

    let href = window.location.search;
    let idPost = href.substring(href.indexOf("id=") + 3, href.indexOf("&"));
    let email = href.substring(href.indexOf("email=") + 6);

    $.ajax({
        url: '../../model/user/getUserInfo.php',
        type: 'GET',
        dataType: 'json',
        data: {
            userEmail: email
        },
        success: function (response) {
            if (response.success) {
                let img = document.getElementById("foto");
                img.className = "img-fluid rounded-circle me-3";
                img.setAttribute("width", 60);
                img.setAttribute("height", 60);
                img.setAttribute(
                    "src",
                    "data:image/jpeg;base64," +  response.userData[0].FotoProfilo
                );

                let usr = document.getElementById("autore-post");
                usr.innerHTML = response.userData[0].Username;
            } else {
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });

    $.ajax({
        url: '../../model/user/getUserInfo.php',
        type: 'GET',
        dataType: 'json',
        data: {
            userEmail: email
        },
        success: function (response) {
            if (response.success) {
                
            } else {
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });

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
                const listBox = document.getElementById("prova");
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
                    let contenuto = document.createElement("span");
                    contenuto.className = "ms-2";
                    container.className = "d-flex";
                    contenuto.innerHTML = jsonData[i].Contenuto;
                    username.innerHTML = jsonData[i].Username + ": ";

                    let userContainer = document.createElement("div");
                    userContainer.className = "btn d-flex col-9 align-items-center me-3";
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