const leaderboardBody = document.getElementById("leaderboardBody");

// Fetch leaderboard data from local storage
const scores = JSON.parse(localStorage.getItem("scores")) || [];

// Sort scores in descending order
scores.sort((a, b) => b.score - a.score);

// Populate the leaderboard
scores.forEach((player, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${player.username}</td>
        <td>${player.score}</td>
    `;
    leaderboardBody.appendChild(row);

    

//localStorage.setItem('scores', JSON.stringify([
 //   { username: 'Tawyy', score: 12 },
 //   { username: 'Irene', score: 25 },
 //   { username: 'TIG', score: 7 }
//]));    