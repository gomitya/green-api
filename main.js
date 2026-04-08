document.getElementById("getSettings").addEventListener('click', () => {
	request("getSettings")
});

document.getElementById("getStateInstance").addEventListener('click', () => {
	request("getStateInstance")
});

document.getElementById("sendMsg").addEventListener('click', () => {
	const cIdEl = document.getElementById("chatIdMsg");
	const msgEl = document.getElementById("textMsg");

	let chatId = cIdEl.value;
	if (chatId.length == 0) {
		alert("Please fill the Message text field.")
		markInput(cIdEl)
		return null
	}

	let msgTxt = msgEl.value;
	if (msgTxt.length == 0) {
		alert("Please fill the Message text field.")
		markInput(msgEl)
		return null
	} else if (msgTxt.length > 20000) {
		alert("Message text length is too long. It should contain not more than 20000 characters.")
		markInput(msgEl)
		return null
	}

	let data = {
		chatId: cIdEl.value,
		message: msgTxt,
	}

	request("sendMessage", "POST", data)
});

document.getElementById("sendFile").addEventListener('click', () => {
	const cIdEl = document.getElementById("chatIdFile")
	const urlEl = document.getElementById("fileUrl")

	let url = URL.parse(urlEl.value);
	if (!url) {
		alert("Invalid File URL provided.")
		return null
	}
	let filename = url.pathname.split('/').filter(Boolean).pop();
	if (!filename) {
		alert("Invalid File URL provided.")
		return null
	}
	const fnRegexp = /^[0-9a-zA-Z-_ ... ]+\.[0-9a-z]+$/;
	if (!fnRegexp.test(filename)) {
		alert("Invalid File URL provided.")
		return null
	}

	data = {
		chatId: cIdEl.value,
		urlFile: url,
		fileName: filename,
	}

	request("sendFileByUrl", "POST", data)
});

const request = (fn, mth = 'GET', data = null) => {
	let url = getApiUrl();
	if (!url) {
		return null
	}

	let id = getIdInstance()
	let token = getToken()
	if (id && token) {
		url.pathname = id + '/' + fn + '/' + getToken()
	} else {
		return null
	}

	let opts = {
		method: mth,
	}

	if (data) {
		opts.body = JSON.stringify(data)
	}

	fetch(url, opts).then((resp) => {
		setStatus(resp.status)

		return resp.json()
	}).then((b) => setAnswer(JSON.stringify(b, null, 2)))
}

const getApiUrl = () => {
	const el = document.getElementById("apiUrl");
	let apiUrl = URL.parse(el.value)

	if (apiUrl) {
		return apiUrl
	} else {
		alert("Invalid ApiURL provided.")
		markInput(el)
		return null
	}
}

const getIdInstance = () => {
	const el = document.getElementById("idInstance")
	let val = el.value

	if (parseInt(val)) {
		return "waInstance" + val
	} else {
		alert("Invalid IdInstance provided.")
		markInput(el)
		return null
	}
}

const getToken = () => {
	const el = document.getElementById("apiToken")

	let token = el.value

	if (token.length == 0) {
		alert("Invalid apiTokenInstance provided.")
		markInput(el)
		return null
	}

	return token
}

const setStatus = (code) => {
	const el = document.getElementById("answerStatus")
	el.classList.remove('ok', 'alert')

	el.textContent = code

	if (code == '200') {
		el.classList.add('ok')
	} else {
		el.classList.add('alert')
	}
}

const setAnswer = (text) => {
	const el = document.getElementById("answerBody")

	el.value = text
}

const markInput = (el) => {
	el.classList.add('alert')

	setTimeout(() => {
		el.classList.remove('alert')
	}, 5000);
}
