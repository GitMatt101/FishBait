$('#logout').on("click", function () {
    sessionStorage.clear();
    $.ajax({
        url: "../../model/login/logout.php"
    });
    window.location.href = "../../view/html/login.html";
});