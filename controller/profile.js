window.addEventListener("load", function () {
    const user = sessionStorage.getItem("userEmail");

    // Dati dell'utente
    $.ajax({
        url: '../../model/getUserInfo.php',
        type: 'POST',
        dataType: 'json',
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
            url: '../../model/getSeguiti.php',
            type: 'GET',
            data: {
                seguiti: user,
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    const jsonData = response.utenti;
                    console.log(jsonData.length);
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
                        let username = document.createElement("p");
                        let container = document.createElement("div");
                        container.className = "d-flex mb-3 align-items-center align-items-center";
                        username.innerHTML = jsonData[i].Username;
                        container.appendChild(pfp);
                        container.appendChild(username);
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
            url: '../../model/getFollowers.php',
            type: 'GET',
            data: {
                followers: user,
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    const jsonData = response.followers;
                    console.log(jsonData.length);
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
                        let username = document.createElement("p");
                        let container = document.createElement("div");
                        container.className = "d-flex mb-3 align-items-center align-items-center";
                        username.innerHTML = jsonData[i].Username;
                        container.appendChild(pfp);
                        container.appendChild(username);
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
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const jsonData = response.posts;
                let postSpace = document.getElementById("post-space");
                for (let i = 0; i < jsonData.length; i++) {
                    let element = document.createElement("div");
                    element.className = "col-4 mb-2";
                    element.setAttribute("id", jsonData[i].ID);

                    let image = document.createElement("img");
                    image.className = "img-fluid w-100 h-100";
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
