function myFunction() {
    let element = document.body;
    element.dataset.bsTheme = element.dataset.bsTheme == "dark" ? "light" : "dark";

    let icons = document.querySelectorAll('.theme-icon');
    icons.forEach(function(icon) {
        if (element.dataset.bsTheme == "dark") {
            icon.classList.remove('text-dark');
            icon.classList.add('text-light');
        } else {
            icon.classList.remove('text-light');
            icon.classList.add('text-dark');
        }
    });

    let navbar = document.querySelector('.navbar'); 
    if (element.dataset.bsTheme == "dark") {
        navbar.style.backgroundColor = "rgb(33, 37, 41)"; 
    } else {
        navbar.style.backgroundColor = "white";
    }
}

