document.getElementById('hide-password').addEventListener('click', function() {
    if (document.getElementById('password').type === 'password') {
        document.getElementById('password').type = '';
        document.getElementById('hide-password').className = 'btn btn-outline-secondary far fa-eye';
    } else {
        document.getElementById('password').type = 'password';
        document.getElementById('hide-password').className = 'btn btn-outline-secondary far fa-eye-slash';
    }
});

document.getElementById('hide-password2').addEventListener('click', function() {
    if (document.getElementById('password2').type === 'password') {
        document.getElementById('password2').type = '';
        document.getElementById('hide-password2').className = 'btn btn-outline-secondary far fa-eye';
    } else {
        document.getElementById('password2').type = 'password';
        document.getElementById('hide-password2').className = 'btn btn-outline-secondary far fa-eye-slash';
    }
});