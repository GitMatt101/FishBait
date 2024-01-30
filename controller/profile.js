window.addEventListener("load", function () {
    let user = sessionStorage.getItem("userEmail");

    // Dati dell'utente
    $.ajax({
        url: '../../model/getUserInfo.php',
        type: 'POST',
        data: {
            targetUser: user,
        },
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
});
