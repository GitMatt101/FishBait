$('#logout').on("click", function () {
    sessionStorage.clear();
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "../../view/html/login.html";
    $.ajax({
        url: "../../model/php/logout.php",
        processData: false,
        contentType: false
    });
});