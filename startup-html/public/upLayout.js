const maxSelection = 10; 
const selectedRadioButtons = [];

function handleRadioButtonSelection(event) {
  const radioButton = event.target;
  const radioButtonId = radioButton.id;
  if (radioButton.checked) {
    if (selectedRadioButtons.length < maxSelection) {
      selectedRadioButtons.push(radioButtonId);
      radioButton.parentElement.classList.add('challenge-selected');

    } else {
      radioButton.checked = false;
    }
  } else {
    selectedRadioButtons.splice(selectedRadioButtons.indexOf(radioButtonId), 1);
  }
}

document.querySelectorAll('.layout').forEach((radioButton) => {
  radioButton.addEventListener('change', handleRadioButtonSelection);
});


const buttonForm = document.getElementById('button-form');
buttonForm.addEventListener('submit', function (event) {
  if (selectedRadioButtons.length !== 10) {
    event.preventDefault(); // Prevent form submission
    alert('Please select exactly 10 buttons.');
  } else {
    localStorage.setItem('selectedButtons', JSON.stringify(selectedRadioButtons));
    saveLayout(selectedRadioButtons);
    alert('Selection Confirmed');
  }
});

// On page load, you can load the previously selected buttons from local storage and update the checked state
window.addEventListener('load', () => {
  const storedSelectedButtons = localStorage.getItem('selectedButtons');
  if (storedSelectedButtons) {
    const selectedButtonsArray = JSON.parse(storedSelectedButtons);
    selectedButtonsArray.forEach((buttonId) => {
      const radioButton = document.getElementById(buttonId);
      if (radioButton) {
        radioButton.checked = true;
        radioButton.parentElement.classList.add('challenge-selected');
        selectedRadioButtons.push(buttonId);
      }
    });
  }
});

const clearButton = document.getElementById('clear-button');
if (clearButton) 
{
  clearButton.addEventListener('click', clearSelections);
}

function clearSelections() 
{
  selectedRadioButtons.length = 0;
  document.querySelectorAll('.layout-label input:checked').forEach((radioButton) => {
    radioButton.parentElement.classList.remove('challenge-selected');
    radioButton.checked = false;
  });
}

async function loadLayouts() {
  let layouts = [];
   try {
    // Get the latest high scores from the service
    const response = await fetch('/api/layouts');
    layouts = await response.json();

    // Save the scores in case we go offline in the future
    //localStorage.setItem('layouts', JSON.stringify(layouts));
  } catch {
    // If there was an error then just use the last saved scores
    const layoutText = localStorage.getItem('layouts');
    if (layoutText) {
      layouts = JSON.parse(layoutText);
    }
  }

  displayLayouts(layouts);
}

function displayLayouts(layouts) {
  const tableBodyEl = document.querySelector('#layouts');

  if (layouts.length) {
    // Update the DOM with the scores
    for (const [i, layout] of layouts.entries()) {
      const positionTdEl = document.createElement('td');
      positionTdEl.setAttribute("class", "formatted-table");
      const nameTdEl = document.createElement('td');
      nameTdEl.setAttribute("class", "player-name");
      const layoutTdEl = document.createElement('td');
      layoutTdEl.setAttribute("class", "player-layout");
      const dateTdEl = document.createElement('td');
      dateTdEl.setAttribute("class", "formatted-table");

      positionTdEl.textContent = i + 1;
      nameTdEl.textContent = layout.name;
      //layoutTdEl.textContent = layout.layout;
      dateTdEl.textContent = layout.date;

      const challengeLink = document.createElement('a');
      challengeLink.setAttribute('href', 'play.html');
      challengeLink.textContent = 'Challenge!';

      challengeLink.addEventListener('click', function () {
        localStorage.setItem('userChallenge', JSON.stringify(layout.layout));
        localStorage.setItem('vsUser', JSON.stringify(layout.name));
      });

      layoutTdEl.appendChild(challengeLink);


      const rowEl = document.createElement('tr');
      rowEl.appendChild(positionTdEl);
      rowEl.appendChild(nameTdEl);
      rowEl.appendChild(layoutTdEl);
      rowEl.appendChild(dateTdEl);

      tableBodyEl.appendChild(rowEl);
    }
  } else {
    tableBodyEl.innerHTML = '<tr><td colSpan=4>Be the first to provide a layout!</td></tr>';
  }
}



async function saveLayout(layoutToSave) {
    const userName = localStorage.getItem("userName");
    const date = new Date().toLocaleDateString();
    const userLayout = layoutToSave
    const newLayout = {name: userName, layout: userLayout, date: date};

    try {
      const response = await fetch('/api/layout', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(newLayout),
      });

      // Store what the service gave us as the high scores
      const layouts = await response.json();
      //localStorage.setItem('layouts', JSON.stringify(layouts));
    } catch {
      // If there was an error then just track scores locally

    }
  }

loadLayouts();