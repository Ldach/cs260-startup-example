const maxSelection = 10; 
const selectedRadioButtons = [];
var challengeButtons = [];
const ChallengeStartEvent = 'challengeStart';
const GameStartEvent = 'gameStart';

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
socket.onopen = (event) => {
  displayMsg('system', 'game', 'connected');
};
socket.onclose = (event) => {
  displayMsg('system', 'game', 'disconnected');
};
socket.onmessage = async (event) => {
  const msg = JSON.parse(await event.data.text());
  if (msg.type === ChallengeStartEvent) {
    displayMsg('player', msg.from, `is challenging ${msg.value}`);
  } else if (msg.type === GameStartEvent) {
    displayMsg('player', msg.from, `started a new game`);
  }
};


function handleRadioButtonSelection(event) {
  if (localStorage.getItem('challengeButtons'))
  {
    challengeButtons = JSON.parse(localStorage.getItem('challengeButtons')) || [];
    localStorage.removeItem('challengeButtons');
  }
  const radioButton = event.target;
  const radioButtonId = radioButton.id;

  if (radioButton.checked) 
  {
    selectedRadioButtons.push(radioButtonId);
  }
  else 
  {
    selectedRadioButtons.splice(selectedRadioButtons.indexOf(radioButtonId), 1);
  }

  if (isChallengeButton(radioButtonId)) {
    radioButton.parentElement.classList.add('challenge-selected');
  } else {
    radioButton.parentElement.classList.add('notchallenge-selected');
  }
}

function isChallengeButton(buttonId) {
  return challengeButtons.includes(buttonId);
}

document.querySelectorAll('.layout').forEach((radioButton) => {
  radioButton.addEventListener('change', handleRadioButtonSelection);
});

// On page load, you can load the previously selected buttons from local storage and update the checked state
window.addEventListener('load', () => {

  const playerNameEl = document.querySelector('.player-name');
  if (localStorage.getItem('challengeButtons'))
  {
    challengeButtons = JSON.parse(localStorage.getItem('challengeButtons')) || [];
    localStorage.removeItem('challengeButtons');
  }


  var playerName;
  if (localStorage.getItem('userName'))
  {
    playerName = localStorage.getItem('userName');
  }
  else
  {
    playerName = "Mystery Player";
  }

  playerNameEl.textContent = playerName;

  if (localStorage.getItem('userChallenge'))
  {
    const userChallenge = JSON.parse(localStorage.getItem('userChallenge'));
    const vsUser = JSON.parse(localStorage.getItem('vsUser'));
    localStorage.setItem('challengeButtons', JSON.stringify(userChallenge));
    localStorage.removeItem('userChallenge');
    localStorage.removeItem('vsUser');
    broadcastEvent(playerName, ChallengeStartEvent, vsUser);
  }
  else
  {
    selectRandomButtons();
    localStorage.setItem('challengeButtons', JSON.stringify(selectedRadioButtons));
    broadcastEvent(playerName, GameStartEvent, {});
  }

  if (localStorage.getItem('challengeButtons'))
  {
    challengeButtons = JSON.parse(localStorage.getItem('challengeButtons')) || [];
    localStorage.removeItem('challengeButtons');
  }
  localStorage.removeItem('layouts');

});

function selectRandomButtons() {
    const radioButtons = document.querySelectorAll('.layout-label input');
    const shuffledRadioButtons = Array.from(radioButtons).sort(() => 0.5 - Math.random()); // Shuffle the buttons
  
    for (let i = 0; i < maxSelection; i++) {
      const radioButton = shuffledRadioButtons[i];
      if (radioButton) {
        radioButton.checked = true;
      }
    }
  
    // Update the array of selected radio buttons
    selectedRadioButtons.length = 0; // Clear the array
    document.querySelectorAll('.layout-label input:checked').forEach((radioButton) => {
      selectedRadioButtons.push(radioButton.id);
      radioButton.checked = false;
    });
  }

const resetButton = document.getElementById('reset-button');
if (resetButton) 
{
  resetButton.addEventListener('click', clearSelections);
}

function clearSelections() 
{
  selectedRadioButtons.length = 0;
  document.querySelectorAll('.layout-label input:checked').forEach((radioButton) => {
    radioButton.checked = false;
    radioButton.parentElement.classList.remove('challenge-selected');
    radioButton.parentElement.classList.remove('notchallenge-selected');

  });
  selectRandomButtons();
  localStorage.setItem('challengeButtons', JSON.stringify(selectedRadioButtons));

  
}


function displayMsg(cls, from, msg) {
  const chatText = document.querySelector('#player-messages');
  chatText.innerHTML =
    `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
}

function broadcastEvent(from, type, value) {
  const event = {
    from: from,
    type: type,
    value: value,
  };
 // socket.send(JSON.stringify(event));
 if (socket.readyState === WebSocket.OPEN)
 {
    socket.send(`{"from":"${from}", "type":"${type}","value":"${value}"}`);
 }
 else
 {
    setTimeout(() => { broadcastEvent(from,type,value) }, 1000)
 }

}
