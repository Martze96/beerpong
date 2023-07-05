document.addEventListener('DOMContentLoaded', function () {
    var generateTeamsBtn = document.getElementById('generateTeamsBtn');
    var matchupsDiv = document.getElementById('matchups');
    let teamsDiv = document.getElementById("teams");
    let rankingDiv = document.getElementById("ranking");
    let participantsInput = document.getElementById('participants')

    if (localStorage.getItem("matchups")) {
        teamsDiv.innerHTML = localStorage.getItem('teams');
        matchupsDiv.innerHTML = localStorage.getItem('matchups');
        matchupsDiv.style.display = 'flex';
        rankingDiv.innerHTML = localStorage.getItem('ranking');
        rankingDiv.style.display = 'block';
        document.getElementById("resetButton").addEventListener('click', () => {
            var confirmed = confirm('Möchtest du sicher den Spielplan und alle Teilnehmer zurücksetzen?');

            if (confirmed) {
                localStorage.removeItem('teams');
                localStorage.removeItem('matchups');
                localStorage.removeItem('ranking');
                localStorage.removeItem('winnerSelectData');
                location.reload();
            } else {
                // Cancel deletion
                // ...
            }
        });
    }

    if (localStorage.getItem('winnerSelectData')) {
        let winnerStorage = JSON.parse(localStorage.getItem('winnerSelectData'));
        let selectList = document.getElementsByClassName('winner-selection');

        for (let i = 0; i < selectList.length; i++) {
            let classname = selectList[i].classList.item(1);
            selectList[i].addEventListener('change', (event) => handleWinnerSelect(event))

            for (let data in winnerStorage) {
                if (classname === data) {
                    selectList[i].value = winnerStorage[data];
                }
            }

        }
        calculatePointsAndSort();
    }

    if (localStorage.getItem('participants')) {
        participantsInput.value = localStorage.getItem('participants')
    }

    generateTeamsBtn.addEventListener('click', function () {
        localStorage.setItem('participants', participantsInput.value)
        matchupsDiv.style.display = 'flex';
        rankingDiv.style.display = 'block';
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
    displayRanking(teams);
    calculatePointsAndSort();


    localStorage.setItem('matchups', document.getElementById("matchups").innerHTML);
    localStorage.setItem('teams', document.getElementById("teams").innerHTML);
    localStorage.setItem('ranking', document.getElementById("ranking").innerHTML);
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
    var numTeams = teams.length;
    var rounds = numTeams - 1;
    var halfNumTeams = Math.ceil(numTeams / 2);

    // Generate all possible matchups
    for (var round = 0; round < rounds; round++) {
        var matchupsRound = [];

        for (var i = 0; i < halfNumTeams; i++) {
            var team1 = teams[i];
            var team2 = teams[numTeams - 1 - i];

            if (previousTeam === null || team1 !== previousTeam) {
                matchupsRound.push({ team1: team1, team2: team2 });
                previousTeam = team2;
            }
        }

        matchups.push(matchupsRound);
        teams.splice(1, 0, teams.pop());
    }

    // Flatten the matchups array
    matchups = matchups.reduce((acc, val) => acc.concat(val), []);

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
    button.textContent = 'Turnier und Teilnehmer Zurücksetzen';
    button.setAttribute('id', 'resetButton');
    button.style.backgroundColor = '#d10000';
    button.addEventListener('click', function () {
        var confirmed = confirm('Möchtest du sicher den Spielplan und alle Teilnehmer zurücksetzen?');

        if (confirmed) {
            localStorage.removeItem('teams');
            localStorage.removeItem('matchups');
            localStorage.removeItem('ranking');
            localStorage.removeItem('winnerSelectData');
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
    let winnerHeader = document.createElement('th');
    winnerHeader.textContent = 'Gewinner'
    headerRow.appendChild(winnerHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    var tbody = document.createElement('tbody');
    matchups.forEach(function (matchup, index) {

        var matchupRow = document.createElement('tr');
        var matchupCell = document.createElement('td');
        let matchupVSCell = document.createElement('td');
        matchupVSCell.textContent = "VS";
        let matchupCell2 = document.createElement('td');
        matchupCell.textContent = matchup.team1.join(',');
        matchupCell2.textContent = matchup.team2.join(',');

        let winnerCell = document.createElement('td');
        let winnerOptions = ['', matchupCell.textContent, matchupCell2.textContent];
        let winnerSelection = document.createElement("select");
        winnerSelection.setAttribute('class', 'winner-selection winner-' + index);

        winnerOptions.map(option => {
            let selectOption = document.createElement('option');
            selectOption.value = option;
            selectOption.text = option;
            winnerSelection.appendChild(selectOption);
        })



        winnerSelection.addEventListener('change', (event) => handleWinnerSelect(event));

        winnerCell.appendChild(winnerSelection);


        matchupRow.appendChild(matchupCell);
        matchupRow.appendChild(matchupVSCell);
        matchupRow.appendChild(matchupCell2);
        matchupRow.appendChild(winnerCell);
        tbody.appendChild(matchupRow);
    });

    table.appendChild(tbody);
    matchupsContainer.appendChild(table);

}

function handleWinnerSelect(event) {
    if (localStorage.getItem('winnerSelectData')) {
        let winnerList = JSON.parse(localStorage.getItem('winnerSelectData'));
        winnerList[event.target.classList.item(1)] = event.target.value;
        localStorage.setItem('winnerSelectData', JSON.stringify(winnerList));
        calculatePointsAndSort();
    } else {
        let newWinnersList = {};
        newWinnersList[event.target.classList.item(1)] = event.target.value;
        localStorage.setItem('winnerSelectData', JSON.stringify(newWinnersList));
        calculatePointsAndSort();
    }
}

function displayRanking(teams) {
    var rankingContainer = document.getElementById('ranking');
    rankingContainer.innerHTML = '<h3>Platzierungsliste:</h3>';

    var table = document.createElement('table');
    table.className = 'ranking-table';
    table.id = 'ranking-table';
    table.style.width = '100%';

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    let headerCell0 = document.createElement('th');
    headerCell0.style.textAlign = 'center'
    headerCell0.textContent = 'Platzierung'
    headerRow.appendChild(headerCell0);

    var headerCell1 = document.createElement('th');
    headerCell1.textContent = 'Teams';
    headerRow.appendChild(headerCell1);

    let headerCell2 = document.createElement('th');
    headerCell2.textContent = 'Punkte';
    headerRow.appendChild(headerCell2);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

    for (var i = 0; i < teams.length; i++) {
        var row = document.createElement('tr');

        let rankingCell = document.createElement('td');
        rankingCell.textContent = i + 1;
        row.appendChild(rankingCell);

        var teamCell = document.createElement('td');
        teamCell.textContent = teams[i];
        row.appendChild(teamCell);

        var pointsCell = document.createElement('td');
        pointsCell.textContent = '12';
        row.appendChild(pointsCell);

        tbody.appendChild(row);

        // Apply styles to the first three rows
        if (i === 1) {
            row.style.backgroundColor = 'gold';
        } else if (i === 2) {
            row.style.backgroundColor = 'silver';
        } else if (i === 3) {
            row.style.backgroundColor = 'bronze';
        }
    }

    table.appendChild(tbody);
    rankingContainer.appendChild(table);

}


function calculatePointsAndSort() {
    var matchups = document.getElementById('matchups').getElementsByTagName('tr');
    var teamRows = document.getElementById('teams').getElementsByTagName('tr');

    var points = {};
    // Initialize points object with team names
    for (var i = 0; i < teamRows.length; i++) {
        var cells = teamRows[i].getElementsByTagName('td');

        // Skip rows that contain team labels
        if (cells.length === 0) {
            continue;
        }

        var teamCell1 = cells[0];
        var teamName1 = teamCell1.textContent.trim();
        var teamCell2 = cells[1];
        var teamName2 = teamCell2.textContent.trim();
        points[teamName1] = 0;
        points[teamName2] = 0;
    }


    // Calculate points based on team selections in matchups
    for (var i = 1; i < matchups.length; i++) {
        var winnerSelection = matchups[i].querySelector('.winner-selection');
        var winningTeam = winnerSelection.value;
        if (winningTeam !== '') {
            points[winningTeam] += 1;
        }
    }

    // Convert points object to array of objects for sorting
    var pointsArray = [];
    for (var team in points) {
        pointsArray.push({ team: team, points: points[team] });
    }

    // Sort teams based on points
    pointsArray.sort(function (a, b) {
        return b.points - a.points;
    });

    // Update ranking table with sorted teams and points
    var rankingTable = document.getElementById('ranking-table');
    var rankingRows = rankingTable.getElementsByTagName('tr');
    for (var i = 1; i < rankingRows.length; i++) {
        var teamCell = rankingRows[i].getElementsByTagName('td')[1];
        var pointsCell = rankingRows[i].getElementsByTagName('td')[2];
        var teamName = teamCell.textContent.trim();
        var teamPoints = points[teamName];
        pointsCell.textContent = teamPoints;
    }


    let tbody = rankingTable.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    // Reorder ranking table rows based on sorted teams

    for (var i = 0; i < pointsArray.length; i++) {
        let row = document.createElement('tr');
        let place = document.createElement('td');
        place.textContent = i + 1 + '.';
        place.style.textAlign = 'center';
        place.style.fontWeight = '700';
        let teamName = document.createElement('td');
        teamName.textContent = pointsArray[i].team;
        let points = document.createElement('td');
        points.style.textAlign = 'center';
        points.textContent = pointsArray[i].points;
        points.style.fontWeight = '700';
        row.appendChild(place);
        row.appendChild(teamName);
        row.appendChild(points);
        tbody.appendChild(row);
        // Apply styles to the first three rows
        if (i === 0) {
            row.style.backgroundColor = 'gold';
            console.log("goold")
        } else if (i === 1) {
            row.style.backgroundColor = 'silver';
        } else if (i === 2) {
            row.style.backgroundColor = '#bf9726';
        }
    }
}



function findRowByTeamName(table, teamName) {
    var rows = table.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');

        for (var j = 0; j < cells.length; j++) {
            if (cells[j].textContent.trim() === teamName) {
                return rows[i];
            }
        }
    }

    return null; // Row not found
}








