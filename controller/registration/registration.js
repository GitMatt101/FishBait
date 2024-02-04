document.getElementById("conferma").onclick = function() {
    const email = document.getElementById('email').value;
    const password1 = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const username = document.getElementById('username').value;
    const nome = document.getElementById('nome').value;
    const cognome = document.getElementById('cognome').value;
    const pfp = document.getElementById('pfp').files[0];
    const data = document.getElementById('data').value;
    const descrizione = document.getElementById('descrizione').value;

    if (password1 === password2) {
        sendDataToPHP(email, password1, username, nome, cognome, pfp, data, descrizione);
    } else {
        document.getElementById('error').innerHTML = "Le password non corrispondono";
    }
}

function sendDataToPHP(email, password, username, nome, cognome, pfp, data, descrizione) {
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    formData.append('nome', nome);
    formData.append('cognome', cognome);
    formData.append('pfp', pfp);
    formData.append('data', data);
    formData.append('descrizione', descrizione);

    $.ajax({
        type: 'POST',
        url: '../../model/registration/registration.php', 
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                sessionStorage.setItem("userEmail", email);
                window.location.href = "../../view/html/profile.html?email=" + email;
            } else {
                document.getElementById('error').innerHTML = response.error;
            }
        },
        error: function(error) {
            console.log("Ajax error:", error);
        }
    });
}