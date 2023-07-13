const getPermissions = () => {
	//default granted denied
	if (Notification.permission === 'granted') {
		//pass
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission().then(permission => {
			//pass
		})
	}
}

document.addEventListener("DOMContentLoaded", () => {
	getPermissions();
});
