const maxSelection = 10; 
const selectedRadioButtons = [];

function handleRadioButtonSelection(event) {
  const radioButton = event.target;
  const radioButtonId = radioButton.id;
  const challengeButtons = JSON.parse(localStorage.getItem('challengeButtons')) || [];

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
  const challengeButtons = JSON.parse(localStorage.getItem('challengeButtons')) || [];
  return challengeButtons.includes(buttonId);
}

document.querySelectorAll('.layout').forEach((radioButton) => {
  radioButton.addEventListener('change', handleRadioButtonSelection);
});

// On page load, you can load the previously selected buttons from local storage and update the checked state
window.addEventListener('load', () => {
  
  selectRandomButtons();
  localStorage.setItem('challengeButtons', JSON.stringify(selectedRadioButtons));

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