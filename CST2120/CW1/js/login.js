const form = document.getElementById('login_form');

form.addEventListener('submit',(event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
   
    // Validate the form fields
    if (username === '') {
        showMessage('Please enter a username.');
        return;
    }

    // Validate email
    if (email === '') {
        showMessage('Please enter an email address.');
        return;
    }

    // Validate password
    if (password === '') {
        showMessage('Please enter your password.');
        return;
    }

    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 4. Find a user matching username + email + password
    const matchedUser = users.find(user =>
        user.username === username &&
        user.email === email &&
        user.password === password
    );

    //If there is no match
    if (!matchedUser) {

        // Does the username exist at all?
        const userExists = users.some(user => user.username === username);

        if (!userExists) {
            showMessage('No account found with that username.');
            return;
        }

        // Username exists — check email
        const emailMatches = users.some(user =>
            user.username === username && user.email === email
        );

        if (!emailMatches) {
            showMessage('Email does not match our records.');
            return;
        }
        // Username and email match then the password is wrong
        showMessage('Incorrect password.');
        return;
    }
    
    // Login successful then the current user is saved
    localStorage.setItem('currentUser', JSON.stringify(matchedUser));

    showMessage('Login successful! Redirecting to game...', 'success');

    setTimeout(() => {
        window.location.href = 'game.html';
    }, 1500);
});

const message = document.getElementById('login_message');

// Helper function to display feedback in the <p> tag
function showMessage(text, type = 'error') {
    message.textContent = text;
    message.className = type;
}
        

