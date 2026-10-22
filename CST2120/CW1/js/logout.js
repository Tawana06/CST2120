const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', () => {
    // Clear the current user from localStorage
    localStorage.removeItem('currentUser');

    // Redirect to the login page
    window.location.href = 'login.html';
});