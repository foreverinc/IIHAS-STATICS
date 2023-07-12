function sendFriendRequestNotification(senderName) {
	if ("Notification" in window) {
		// Request permission to show notifications
		Notification.requestPermission().then(function (permission) {
			if (permission === "granted") {
				// Create the notification
				var notification = new Notification("New Friend Request", {
					body: senderName + " sent you a friend request.",
					icon: "{% static 'img/friend-icon.png' %}",
				});

				notification.onclick = function () {
					// Handle the notification click event
					// ...
				};
			} else if (permission === "denied") {
				// Handle denied permission
				console.log("Permission denied for notifications");
			} else if (permission === "default") {
				// Handle default permission (browser-specific behavior)
				console.log(
					"Permission request for notifications dismissed by the user"
				);

				// Request permission again
				sendFriendRequestNotification(senderName);
			}
		});
	}
}


function sendNotification (name) {
    Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
            const notification=new Notification('Friend request', {
                body: `${name} sent you a friend request`,
                icon:"logo path"
            })
            notification.addEventListener('error', () => {
                alert('You have a new notification')
            })
            notification.addEventListener('close', () => {
                //mark the notification seen
            })
            notification.addEventListener('click', () => {
                //open page to notification page
            })
        } 
        
    })
}