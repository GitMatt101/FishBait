window.addEventListener("load", function () {

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