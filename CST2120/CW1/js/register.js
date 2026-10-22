const form = document.getElementById('registration_form');

form.addEventListener('submit', (event) => {

    event.preventDefault(); // Prevent the form from submitting normally

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = document.getElementById('age').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate the form fields
    if (username === '') {
        showMessage('Please enter a username.');
        return;
    }

    if (username.length < 3) {
        showMessage('Username must be at least 3 characters.');
        return;
    }

    // Validate email
    if (email === '') {
        showMessage('Please enter an email address.');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        showMessage('Please enter a valid email address.');
        return;
    }

    // Validate age
    if (age === '') {
        showMessage('Please enter your age.');
        return;
    }

    const ageNumber = Number(age);

    if (Number.isNaN(ageNumber)) {
        showMessage('Age must be a number.');
        return;
    }
    if (ageNumber < 1 || ageNumber > 100) {
        showMessage('Age must be between 1 and 100.');
        return;
    }

    // Validate password
    if (password.length < 8) {
        showMessage('Password must be at least 8 characters.');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match.');
        return;
    }

    // Load existing users from localStorage (or start with an empty array)
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check the username and email are not already taken
    const usernameTaken = users.some(user => user.username === username);
    if (usernameTaken) {
        showMessage('That username is already taken.');
        return;
    }

    const emailTaken = users.some(user => user.email === email);
    if (emailTaken) {
        showMessage('That email is already registered.');
        return;
    }

    // Build the new user object
    const newUser = {
        username: username,
        email: email,
        age: ageNumber,
        password: password
    };

    // Save it back to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message and redirect to login
    showMessage('Registration successful! Redirecting to login...', 'success');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);

    });

const message = document.getElementById('registration_message');    

// Helper function to display feedback in the <p> tag
function showMessage(text, type = 'error') {
    message.textContent = text;
    message.className = type;
}