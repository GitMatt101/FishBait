function myFunction() {
    var element = document.body;
    element.dataset.bsTheme = element.dataset.bsTheme == "dark" ? "light" : "dark";

    var icons = document.querySelectorAll('.theme-icon');
    icons.forEach(function(icon) {
        if (element.dataset.bsTheme == "dark") {
            icon.classList.remove('text-dark');
            icon.classList.add('text-light');
        } else {
            icon.classList.remove('text-light');
            icon.classList.add('text-dark');
        }
    });
}

