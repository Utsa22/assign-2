let addedPlayers = [];
let playerCount = 0;
const loadPlayers = () => {
    fetch('https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=A')
        .then(res => res.json())
        .then(data => {
            if (data.player) {
                displayPlayers(data.player);
            } 
        })
};

const displayPlayers = (players) => {
    const playerContainer = document.getElementById('player-container');
    playerContainer.innerHTML = '';
    players.forEach(player => {
        const facebookLink = player.strFacebook ? player.strFacebook : '#';
        const twitterLink = player.strTwitter ? player.strTwitter : '#';

        const div = document.createElement('div');
        div.classList.add('col-md-4');
        div.innerHTML = `
            <div class="card">
                <img src="${player.strCutout || 'https://via.placeholder.com/100'}" class="card-img-top" alt="Player Image">
                <div class="card-body">
                    <h5 class="card-title">${player.strPlayer || 'No Name'}</h5>
                    <p class="card-text">Nationality: ${player.strNationality || 'Not Available'}</p>
                    <p class="card-text">Team: ${player.strTeam || 'Not Available'}</p>
                    <p class="card-text">Sport: ${player.strSport || 'Not Available'}</p>
                    <p class="card-text">Salary: ${player.strWage || 'Not Available'}</p>
                    <p class="card-text">Description: ${player.strDescriptionEN ? player.strDescriptionEN.slice(0, 50) : 'No Description'}...</p>
                    <p class="card-text">
                        <a href="${facebookLink}" target="_blank"><i class="fab fa-facebook"></i></a> | 
                        <a href="${twitterLink}" target="_blank"><i class="fab fa-twitter"></i></a>
                    </p>
                    <button class="btn btn-primary" onclick="showPlayerDetails(${player.idPlayer})" data-bs-toggle="modal" data-bs-target="#playerModal">Details</button>
                    <button class="btn btn-warning mt-2" onclick="addToGroup('${player.strPlayer}')">Add to Group</button>
                </div>
            </div>
        `;
        playerContainer.appendChild(div);
    });
};

const showPlayerDetails = (playerId) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`)
        .then(res => res.json())
        .then(data => {
            const player = data.players[0];
            document.getElementById('modal-body').innerHTML = `
                <img src="${player.strCutout}" class="img-fluid" alt="Player Image">
                <h5>${player.strPlayer}</h5>
                <p>Nationality: ${player.strNationality}</p>
                <p>Team: ${player.strTeam}</p>
                <p>Sport: ${player.strSport}</p>
                <p>Salary: ${player.strWage || 'Not Available'}</p>
                <p>Description: ${player.strDescriptionEN ? player.strDescriptionEN.slice(0, 50) : 'No Description'}...</p>
            `;
        })
};

const addToGroup = (playerName) => {
    if (playerCount >= 11) {
        alert('You can only add up to 11 players!');
        return;
    }
    if (!addedPlayers.includes(playerName)) {
        addedPlayers.push(playerName);
        playerCount++;
        updateGroupSection();
    }
};

const updateGroupSection = () => {
    const groupList = document.getElementById('group-list');
    const playerCountElement = document.getElementById('player-count');
    groupList.innerHTML = '';
    addedPlayers.forEach(player => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = player;
        groupList.appendChild(li);
    });
    playerCountElement.textContent = playerCount;
};

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = document.getElementById('search-input').value;
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            if (data.player) {
                displayPlayers(data.player);
            } 
            else {
                alert('No players found for this search term.');
            }
        })
});

loadPlayers();
