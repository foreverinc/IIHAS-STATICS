const getPermissions = () => {
	if (Notification.permission === "granted") {
		// Permission already granted
	} else if (Notification.permission !== "denied") {
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				showFirstNotification();
			}
		});
	}
};

document.addEventListener("DOMContentLoaded", () => {
	getPermissions();
});

const showFirstNotification = () => {
	const notification = new Notification("Notification from Redo", {
		body: "Hey friend, Redo app here",
		icon: "https://i.ibb.co/YbFPdWS/redo-2-removebg-preview.png",
	});
	notification.onclick = (e) => {
		window.location.href="/"
	}
};
