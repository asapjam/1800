const getResponse = await fetch("http://localhost:5167/usersAPI");
const usersJson = await getResponse.json();

const pageFeedback = document.getElementById("pageFeedback");

// CREATE USER START

const createNewUserContainer = document.getElementById("createNewUser");
const createNewUserButton = document.getElementById("createNewUserButton");
const createNewUserForm = document.getElementById("createNewUserForm");
const createNewUserDiv = document.getElementById("createNewUserDiv");

// BUTTON TO SHOW CREATE USERNAME FORM LOGIC

createNewUserButton.addEventListener("click", async (e) => {
	createNewUserDiv.style.display = "block";
	createNewUserButton.style.display = "none";
});

// FORM TO CREATE USER LOGIC

createNewUserDiv.addEventListener("submit", async (e) => {
	// if user exists, throw error and do not submit form.
	e.preventDefault();
	const formData = new FormData(createNewUserForm);
	const userAsObject = Object.fromEntries(formData);

	if (doesUserAlreadyExist(userAsObject.username)) {
		pageFeedback.textContent = "Username is taken, try another one!";
	}
	// if user does not exist add it to database and give confirmation message
	else {
		const serverUserObject = await postUserToDatabase(userAsObject);
		pageFeedback.textContent =
			"User successfully created! User Id: " + serverUserObject.id;
		createNewUserDiv.style.display = "none";
		logInButton.style.display = "none";
	}
});

// VERIFY IF USER EXISTS LOGIC

function doesUserAlreadyExist(usernameToCheck) {
	const usersArrayCopy = usersJson;
	for (let i = 0; i < usersArrayCopy.length; i++) {
		if (usersArrayCopy[i].username == usernameToCheck) {
			return usersArrayCopy[i].id;
		}
	}
	return null;

	//You cant return out of a ForEach loop oh my god bruh
	// usersArrayCopy.forEach(user => {
	//     if(user.username == usernameToCheck){
	//         console.log("user in database username");
	//         console.log(user.username);
	//         console.log("usernameToCheck");
	//         console.log(usernameToCheck);

	//         return true;
	//     };
	// });
}

// POST DATA TO DATABASE LOGIC

async function postUserToDatabase(new_user) {
	console.log(JSON.stringify(new_user));
	const outgoing = await fetch("http://localhost:5167/usersAPI", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(new_user),
	});
	const response = outgoing.json();
	return await response;
}

// CREATE USER END
// LOG IN EXISTING USER START

const logInContainer = document.getElementById("logIn");
const logInButton = document.getElementById("logInButton");
const logInForm = document.getElementById("logInForm");
const logInDiv = document.getElementById("logInDiv");

logInButton.addEventListener("click", async (e) => {
	logInDiv.style.display = "block";
	logInButton.style.display = "none";
});

logInDiv.addEventListener("submit", async (e) => {
	// if user exists, allow them to log in.
	e.preventDefault();
	const formData = new FormData(logInForm);
	const userAsObject = Object.fromEntries(formData);

	if (isCorrectCredentials(userAsObject)) {
		pageFeedback.textContent = "Logged in!";
		logInDiv.style.display = "none";
		createNewUserButton.style.display = "none";
		storeSessionIdLocally(isCorrectCredentials(userAsObject));
	}
	// if credentials dont match, then throw an error message and ask them to try again.
	else {
		pageFeedback.textContent = "Incorrect username/password! Try again...";
	}
});

function isCorrectCredentials(objectToCheck) {
	const usersArrayCopy = usersJson;
	for (let i = 0; i < usersArrayCopy.length; i++) {
		if (
			usersArrayCopy[i].username == objectToCheck.username &&
			usersArrayCopy[i].password == objectToCheck.password
		) {
			return usersArrayCopy[i].id;
		}
	}
	return null;
}

// WE STORE THE SESSION ID IN LOCAL STORAGE SO THAT WE CAN USE IT TO IDENTIFY THE USER IN OTHER PAGES. THIS IS A TEMPORARY SOLUTION, AND IN A REAL APPLICATION, YOU WOULD WANT TO USE MORE SECURE METHODS FOR SESSION MANAGEMENT.

function storeSessionIdLocally(sessionId) {
	sessionStorage.setItem("sessionId", sessionId);
}

// LOG IN EXISTING USER END
// LOG OUT START

const logOutDiv = document.getElementById("logOutDiv");
const sessionId = sessionStorage.getItem("sessionId");

function userIsLoggedIn() {
	if (sessionId) {
		return true;
	} else {
		return false;
	}
}

function createLogOutButton() {
	const logOutButton = document.createElement("button");
	logOutButton.textContent = "Log Out";
	logOutButton.addEventListener("click", async (e) => {
		e.preventDefault();
		removeSessionIdLocally(sessionId);
		pageFeedback.textContent = "Logged out!";
		logOutButton.style.display = "none";
	});
	logOutDiv.appendChild(logOutButton);
}

function removeSessionIdLocally(sessionId) {
	sessionStorage.removeItem("sessionId");
}

// LOG OUT END

if (userIsLoggedIn()) {
	createLogOutButton();
	logInContainer.style.display = "none";
	createNewUserContainer.style.display = "none";
}
