window.addEventListener("load", function() {
    // Controllo il login
    $.ajax({
        url: '../../model/user/getUserInfo.php',
        type: 'GET',
        dataType: 'json',
        data: {
            userEmail: sessionStorage.getItem("userEmail")
        },
        success: function (response) {
            if (!response.success) {
                console.log(response.error);
            }
            if (!response.login) {
                window.location.href = "../../view/html/login.html";
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
});

document.getElementById("conferma").onclick = function() {
    addPost();
}

function addPost() {
    const descrizione = document.getElementById('descrizione').value;
    const luogo = document.getElementById('luogo').value;
    const immagine = document.getElementById('immagine').files[0];

    let formData = new FormData();
    formData.append('descrizione', descrizione);
    formData.append('luogo', luogo);
    formData.append('immagine', immagine);

    $.ajax({
        type: 'POST',
        url: '../../model/post/addPost.php',
        data: formData,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function(response) {
            if (response.success) {
                window.location.href = "../../view/html/home.html";
            } else {
                if (!response.login) {
                    window.location.href = "../../view/html/login.html";
                }
                console.log(response.error);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}