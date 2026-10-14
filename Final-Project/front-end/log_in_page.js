const getResponse = await fetch("http://localhost:5167/usersAPI");
const usersJson = await getResponse.json();

const createNewUserButton = document.getElementById("createNewUserButton");
const createNewUserForm = document.getElementById("createNewUserForm");
const createNewUserDiv = document.getElementById("createNewUserDiv");
const createNewUserFeedback = document.getElementById("createNewUserFeedback");

// BUTTON TO SHOW CREATE USERNAME FORM LOGIC

createNewUserButton.addEventListener("click", async (e) => {
    createNewUserDiv.style.visibility = "visible";
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
        postUserToDatabase(userAsObject);
        createNewUserFeedback.innerHTML = "";
        const newP = document.createElement("p");
        newP.textContent = "User successfully created!";
        createNewUserFeedback.appendChild(newP);
        createNewUserDiv.style.display = "none";
    };
});

// VERIFY IF USER EXISTS LOGIC

function doesUserAlreadyExist(usernameToCheck){
    const usersArrayCopy = usersJson;
    for (let i = 0; i < usersArrayCopy.length; i++){
        if(usersArrayCopy[i].username == usernameToCheck){
            return true;
        };
    };
    return false;

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
    await fetch("http://localhost:5167/usersAPI", {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(new_user)
    });
};
