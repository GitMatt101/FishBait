function login() {
    let formData = new FormData();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    formData.append('email', email);
    formData.append('password', password);
    formData.append('remember', remember);
    $.ajax({
        type: 'POST',
        url: '../../model/login/login.php', 
        data: formData,
        contentType: false,
        processData: false
    });
}

document.getElementById("confermaLogin").onclick = function() {
    login();
}