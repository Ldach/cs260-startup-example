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