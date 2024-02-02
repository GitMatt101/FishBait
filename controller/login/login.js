function login() {
    let formData = new FormData();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    formData.append('email', email);
    formData.append('password', password);
    $.ajax({
        type: 'POST',
        url: '../../model/login/login.php', 
        data: formData,
        contentType: false,
        processData: false
    });
    sessionStorage.setItem("userEmail", email);
}

document.getElementById("confermaLogin").onclick = function() {
    login();
}