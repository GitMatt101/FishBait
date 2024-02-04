$.ajax({
    url: '../../model/user/getNotifications.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
        if (response.success) {
            const jsonData = response.notifications;
            let count = 0;
            for (let i = 0; i < jsonData.length; i++) {
                if (!jsonData[i].Visualizzato) {
                    count++;
                }
            }
            if (count > 0) {
                let number = document.createElement("span");
                number.className = "badge rounded-pill badge-notification bg-danger m-0 p-1 position-absolute";
                number.setAttribute("id", "notificationsNumber");
                number.innerHTML = count;
                document.getElementById("notifications").appendChild(number);
            }
        }
    },
    error: function(error) {
        console.log("Ajax error: ", error);
    }
});