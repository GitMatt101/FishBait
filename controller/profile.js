window.addEventListener("load", function () {

    let user = sessionStorage.getItem("userEmail");
    $.ajax({
        url: '../../model/getUserInfo.php',
        type: 'POST',
        data: {
            targetUser: user,
        },
        dataType: 'json',
        success: function (data) {
            let userData = data[0];
            $("#user-username").text(userData.Username);
            $("#user-name").text(userData.Nome + " " + userData.Cognome);
            $("#user-bio").text(userData.Descrizione);
            $("#user-birth").text(" Nato il : " + userData.DataNascita);
            if (userData.FotoProfilo) {
                $("#user-photo").attr("src", "data:image/jpeg;base64," + userData.FotoProfilo);
            } else {
                $("#user-photo").attr("src", "../../resources/img/place-holder-pfp.jpg");
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
});
