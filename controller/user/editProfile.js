window.addEventListener('load', function () {
    $.ajax({
        type: 'GET',
        url: '../../model/user/getUserInfo.php', 
        data: {
            userEmail: this.sessionStorage.getItem('userEmail')
        },
        dataType: "json",
        success: function(response) {
            if (response.success) {
                const jsonData = response.userData[0];
                document.getElementById('username').value = jsonData.Username;
                document.getElementById('nome').value = jsonData.Nome;
                document.getElementById('cognome').value = jsonData.Cognome;
                document.getElementById('descrizione').value = jsonData.Descrizione;
            } else {
                if (!response.login) {
                    window.location.href = '../../view/login/login.html';
                }
                console.log(response.error);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
});


document.getElementById("conferma").onclick = function () {
    const pfp = document.getElementById('pfp').files[0];
    const username = document.getElementById('username').value;
    const nome = document.getElementById('nome').value;
    const cognome = document.getElementById('cognome').value;
    const descrizione = document.getElementById('descrizione').value;
    let formData = new FormData();
    formData.append('pfp', pfp);
    formData.append('username', username);
    formData.append('nome', nome);
    formData.append('cognome', cognome);
    formData.append('descrizione', descrizione);
    $.ajax({
        type: 'POST',
        url: '../../model/user/editProfile.php', 
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                window.location.href = '../../view/html/profile.html?email=' + sessionStorage.getItem('userEmail');
            } else {
                if (!response.login) {
                    window.location.href = '../../view/login/login.html';
                }
                console.log(response.error);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}