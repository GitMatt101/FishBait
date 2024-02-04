window.addEventListener('load', function() {

    // Visualizza i post salvati
    $.ajax({
        url: '../../model/post/savedPosts.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                const jsonData = response.posts;
                let postSpace = document.getElementById("post-space");
                for (let i = 0; i < jsonData.length; i++) {
                    let element = document.createElement("div");
                    element.className = "col-4 mb-2 d-flex flex-wrap align-items-center";
                    element.setAttribute("id", jsonData[i].ID);

                    let image = document.createElement("img");
                    image.className = "img-fluid";
                    image.setAttribute(
                      "src",
                      "data:image/jpeg;base64," + jsonData[i].Foto
                    );
                    image.setAttribute("alt", "");
                    element.appendChild(image);
                    element.onclick = function() {
                        window.location.href = "../../view/html/post.html?id=" + jsonData[i].ID;
                    }
                    postSpace.appendChild(element);
                }
            } else {
                if (!response.login) {
                    window.location.href = "../../view/html/login.html";
                }
                console.log(response.error);
            }
        },
        error: function (error) {
            console.error('Ajax error: ', error);
        }
    });
});