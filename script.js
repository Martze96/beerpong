document.addEventListener('DOMContentLoaded', function () {
    var generateTeamsBtn = document.getElementById('generateTeamsBtn');
    var matchupsDiv = document.getElementById('matchups');
    let teamsDiv = document.getElementById("teams");
    let participantsInput = document.getElementById('participants')

    if (localStorage.getItem("matchups")) {
        teamsDiv.innerHTML = localStorage.getItem('teams');
        matchupsDiv.innerHTML = localStorage.getItem('matchups');
        document.getElementById("resetButton").addEventListener('click', () => {
            var confirmed = confirm('Möchtest du sicher den Spielplan und alle Teilnehmer zurücksetzen?');

            if (confirmed) {
                localStorage.removeItem('teams');
                localStorage.removeItem('matchups');
                location.reload();
            } else {
                // Cancel deletion
                // ...
            }
        });
    }

    if (localStorage.getItem('participants')) {
        participantsInput.value = localStorage.getItem('participants')
    }

    generateTeamsBtn.addEventListener('click', function () {
        localStorage.setItem('participants', participantsInput.value)
        matchupsDiv.style.display = 'flex';
        generateTeamsAndMatchups();
    });

});



function generateTeamsAndMatchups() {

    var participantsTextArea = document.getElementById('participants');
    var participants = participantsTextArea.value.split('\n').filter(function (participant) {
        return participant.trim() !== '';
    });

    if (participants.length === 0) {
        participants = generateDummyNames(20);
    }

    var teams = createTeams(participants);
    displayTeams(teams);

    var matchups = generateMatchups(teams);
    displayMatchups(matchups);

    localStorage.setItem('matchups', document.getElementById("matchups").innerHTML);
    localStorage.setItem('teams', document.getElementById("teams").innerHTML);
}

function generateDummyNames(count) {
    var dummyNames = [
        'Julian Miller',
        'Ellen Bauer',
        'Luis Eble',
        'Stefan Heilig',
        'Alex Heilig',
        'Stefan Djuric',
        'Julian Voigt',
        'Ava Miller',
        'Benjamin Thomas',
        'Mia Martinez',
        'Alexander Robinson',
        'Charlotte Garcia',
        'Daniel Jackson',
        'Amelia Rodriguez',
        'Matthew Thompson',
        'Harper Hernandez',
        'Joseph Moore',
        'Evelyn Lopez',
        'David Clark',
        'Abigail Lewis'
    ];

    if (count <= dummyNames.length) {
        return dummyNames.slice(0, count);
    }

    var result = [];
    for (var i = 0; i < count; i++) {
        var randomIndex = Math.floor(Math.random() * dummyNames.length);
        result.push(dummyNames[randomIndex]);
    }

    return result;
}

function createTeams(participants) {
    // Shuffle the participants array
    participants = shuffleArray(participants);

    var teams = [];
    while (participants.length >= 2) {
        var team = [participants.pop(), participants.pop()];
        teams.push(team);
    }
    return teams;
}

// Helper function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function generateMatchups(teams) {
    var matchups = [];
    var previousTeam = null;

    // Generate all possible matchups
    for (var i = 0; i < teams.length - 1; i++) {
        for (var j = i + 1; j < teams.length; j++) {
            if (previousTeam === null || teams[i] !== previousTeam) {
                var matchup = {
                    team1: teams[i],
                    team2: teams[j]
                };
                matchups.push(matchup);
                previousTeam = teams[j];
            }
        }
    }

    // Shuffle the matchups randomly
    for (var k = matchups.length - 1; k > 0; k--) {
        var randomIndex = Math.floor(Math.random() * (k + 1));
        var temp = matchups[k];
        matchups[k] = matchups[randomIndex];
        matchups[randomIndex] = temp;
    }

    return matchups;
}

function displayTeams(teams) {
    var teamsContainer = document.getElementById('teams');
    teamsContainer.innerHTML = '<h3>Teamplan:</h3>';

    var table = document.createElement('table');
    table.className = 'team-table';

    var tbody = document.createElement('tbody');

    var rowCount = Math.ceil(teams.length / 2);

    for (var i = 0; i < rowCount; i++) {
        var row = document.createElement('tr');
        var team1Index = i * 2;
        var team2Index = i * 2 + 1;

        var team1 = teams[team1Index] || '';
        var team2 = teams[team2Index] || '';

        var headerRow = document.createElement('tr');

        var headerCell1 = document.createElement('th');
        headerCell1.textContent = 'Team ' + (team1Index + 1);
        headerRow.appendChild(headerCell1);

        var headerCell2 = document.createElement('th');
        headerCell2.textContent = 'Team ' + (team2Index + 1);
        headerRow.appendChild(headerCell2);

        tbody.appendChild(headerRow);

        var teamRow = document.createElement('tr');

        var cell1 = document.createElement('td');
        cell1.textContent = team1;
        teamRow.appendChild(cell1);

        var cell2 = document.createElement('td');
        cell2.textContent = team2;
        teamRow.appendChild(cell2);

        tbody.appendChild(teamRow);
    }

    table.appendChild(tbody);
    teamsContainer.appendChild(table);

    var button = document.createElement('button');
    button.textContent = 'Spiel Zurücksetzen';
    button.setAttribute('id', 'resetButton');
    button.addEventListener('click', function () {
        var confirmed = confirm('Möchtest du sicher den Spielplan und alle Teilnehmer zurücksetzen?');

        if (confirmed) {
            localStorage.removeItem('teams');
            localStorage.removeItem('matchups');
            location.reload();
        } else {
            // Cancel deletion
            // ...
        }

    });
    teamsContainer.appendChild(button);
}



function displayMatchups(matchups) {
    var matchupsContainer = document.getElementById('matchups');
    matchupsContainer.innerHTML = '<h3>Spielplan:</h3>';

    var table = document.createElement('table');
    table.className = 'matchup-table';

    // Create table header
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    var headerCell = document.createElement('th');
    headerCell.textContent = 'Matchup';
    headerRow.appendChild(headerCell);
    headerCell.colSpan = 3;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    var tbody = document.createElement('tbody');
    console.log(matchups);
    matchups.forEach(function (matchup, index) {

        var matchupRow = document.createElement('tr');
        var matchupCell = document.createElement('td');
        let matchupVSCell = document.createElement('td');
        matchupVSCell.textContent = "VS";
        let matchupCell2 = document.createElement('td');
        matchupCell.textContent = matchup.team1.join(', ');
        matchupCell2.textContent = matchup.team2.join(', ');
        matchupRow.appendChild(matchupCell);
        matchupRow.appendChild(matchupVSCell);
        matchupRow.appendChild(matchupCell2);
        tbody.appendChild(matchupRow);
    });

    table.appendChild(tbody);
    matchupsContainer.appendChild(table);

}

