document.getElementById("confermaLogin").onclick = function() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    if (email === "") {
        email = null;
    }
    if (password === "") {
        password = null;
    }
    $.ajax({
        type: 'POST',
        url: '../../model/login/login.php', 
        data: {
            email: email,
            password: password
        },
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
            console.log("Ajax error: ", error);
        }
    });
}