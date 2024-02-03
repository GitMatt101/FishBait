document.getElementById("search-btn").onclick = function () {
    let cerca = document.getElementById("input-search").value;
    $.ajax({
        url: '../../model/user/getSearch.php',
        type: 'GET',
        dataType: 'json',
        data: {
            lettera: cerca,
        },
        success: function (response) {
            const listBox = document.getElementById("searchResult");
            listBox.innerHTML = "";
            if (response.success) {
                const jsonData = response.cerca;
                for (let i = 0; i < jsonData.length; i++) {
                    let pfp = document.createElement("img");
                    pfp.className = "rounded-circle me-3";
                    if (jsonData[i].FotoProfilo) { 
                        pfp.setAttribute("src", "data:image/jpeg;base64," +  jsonData[i].FotoProfilo);
                    } else {
                        pfp.setAttribute("src", "../../resources/img/place-holder-pfp.jpg");
                    }
                    pfp.setAttribute("alt", "");
                    pfp.setAttribute("width", 60);
                    pfp.setAttribute("height", 60);
                    let username = document.createElement("b");
                    let container = document.createElement("div");
                    container.className = "row";
                    username.innerHTML = jsonData[i].Username;

                    let userContainer = document.createElement("div");
                    userContainer.className = "btn d-flex col-9 align-items-center me-3";
                    userContainer.onclick = function () {
                        window.location.href = "../../view/html/profile.html?email=" + jsonData[i].Email;
                    }
                    userContainer.appendChild(pfp);
                    userContainer.appendChild(username);

                    container.appendChild(userContainer);
                    if (jsonData[i].Username != response.username) {
                        listBox.appendChild(container);
                    }
                }
            } else {
                if (!response.login) {
                    window.location.href = "../../view/html/login.html";
                }
                console.log("Errore: ", response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
}