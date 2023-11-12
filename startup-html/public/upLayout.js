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
    saveLayout();
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

async function loadLayout() {
  const response = await fetch("/api/layouts")
  const scores = await response.json()

  // Modify the DOM to display the scores
}

async function saveLayout(layout) {
    const userName = localStorage.getItem("userName");
    const date = new Date().toLocaleDateString();
    const userLayout = localStorage.getItem("selectedButtons");
    const newLayout = {name: userName, layout: userLayout, date: date};

    try {
      const response = await fetch('/api/layout', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(newLayout),
      });

      // Store what the service gave us as the high scores
      const layouts = await response.json();
      localStorage.setItem('layouts', JSON.stringify(layouts));
    } catch {
      // If there was an error then just track scores locally

    }
  }