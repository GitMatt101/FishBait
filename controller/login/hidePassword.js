document.getElementById('hide-password').addEventListener('click', function() {
    if (document.getElementById('password').type === 'password') {
        document.getElementById('password').type = '';
        document.getElementById('hide-password').className = 'btn btn-outline-secondary far fa-eye';
    } else {
        document.getElementById('password').type = 'password';
        document.getElementById('hide-password').className = 'btn btn-outline-secondary far fa-eye-slash';
    }
});