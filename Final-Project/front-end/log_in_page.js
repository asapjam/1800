const getResponse = await fetch("http://localhost:5167/usersAPI");
const usersJson = await getResponse.json();

// CREATE USER START

const createNewUserButton = document.getElementById("createNewUserButton");
const createNewUserForm = document.getElementById("createNewUserForm");
const createNewUserDiv = document.getElementById("createNewUserDiv");
const createNewUserFeedback = document.getElementById("createNewUserFeedback");

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

    if (doesUserAlreadyExist(userAsObject.username)){
        createNewUserFeedback.innerHTML = "";
        const newP = document.createElement("p");
        newP.textContent = "Username is taken, try another one!";
        createNewUserFeedback.appendChild(newP);
    }
    // if user does not exist add it to database and give confirmation message
    else{
        const serverUserObject = await postUserToDatabase(userAsObject);
        createNewUserFeedback.innerHTML = "";
        const newP = document.createElement("p");
        console.log(serverUserObject);
        newP.textContent = "User successfully created! User Id:" + serverUserObject.id;
        createNewUserFeedback.appendChild(newP);
        createNewUserDiv.style.display = "none";
        logInButton.style.display = "none";
    };
});

// VERIFY IF USER EXISTS LOGIC

function doesUserAlreadyExist(usernameToCheck){
    const usersArrayCopy = usersJson;
    for (let i = 0; i < usersArrayCopy.length; i++){
        if(usersArrayCopy[i].username == usernameToCheck){
            return usersArrayCopy[i].id;
        };
    };
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
};


// POST DATA TO DATABASE LOGIC

async function postUserToDatabase(new_user){
    console.log(JSON.stringify(new_user));
    const outgoing = await fetch("http://localhost:5167/usersAPI", {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(new_user)
    });
    const response = outgoing.json();
    return await response;
};

// CREATE USER END
// LOG IN EXISTING USER START

const logInButton = document.getElementById("logInButton");
const logInForm = document.getElementById("logInForm");
const logInDiv = document.getElementById("logInDiv");
const logInFeedback = document.getElementById("logInFeedback");

logInButton.addEventListener("click", async (e) => {
    logInDiv.style.display = "block";
    logInButton.style.display = "none";
});

logInDiv.addEventListener("submit", async (e) => {
    // if user exists, allow them to log in.
    e.preventDefault();
    const formData = new FormData(logInForm);
    const userAsObject = Object.fromEntries(formData);

    if (isCorrectCredentials(userAsObject)){
        logInFeedback.innerHTML = "";
        const newP = document.createElement("p");
        newP.textContent = "Logged in!";
        logInFeedback.appendChild(newP);
        logInDiv.style.display = "none";
        createNewUserButton.style.display = "none";
    }
    // if credentials dont match, then throw an error message and ask them to try again.
    else{
        logInFeedback.innerHTML = "";
        const newP = document.createElement("p");
        newP.textContent = "Incorrect username/password! Try again...";
        logInFeedback.appendChild(newP);
    };
});

function isCorrectCredentials(objectToCheck){
    const usersArrayCopy = usersJson;
    for (let i = 0; i < usersArrayCopy.length; i++){
        if(usersArrayCopy[i].username == objectToCheck.username && usersArrayCopy[i].password == objectToCheck.password){
            return usersArrayCopy[i].id;
        };
    };
    return null;
};

// LOG IN EXISTING USER END
