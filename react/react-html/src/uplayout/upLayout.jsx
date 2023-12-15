// upLayout.jsx
import React, { useState, useEffect } from 'react';

const maxSelection = 10;
const selectedRadioButtons = [];

function UpLayout() {
  const handleRadioButtonSelection = (event) => {
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
  };

  useEffect(() => {
    document.querySelectorAll('.layout').forEach((radioButton) => {
      radioButton.addEventListener('change', handleRadioButtonSelection);
    });

    const buttonForm = document.getElementById('button-form');
    buttonForm.addEventListener('submit', (event) => {
      if (selectedRadioButtons.length !== 10) {
        event.preventDefault(); // Prevent form submission
        alert('Please select exactly 10 buttons.');
      } else {
        localStorage.setItem('selectedButtons', JSON.stringify(selectedRadioButtons));
        saveLayout(selectedRadioButtons);
        alert('Selection Confirmed');
      }
    });

    const clearButton = document.getElementById('clear-button');
    if (clearButton) {
      clearButton.addEventListener('click', clearSelections);
    }

    // On page load, you can load the previously selected buttons from local storage and update the checked state
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

    loadLayouts();
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const clearSelections = () => {
    selectedRadioButtons.length = 0;
    document.querySelectorAll('.layout-label input:checked').forEach((radioButton) => {
      radioButton.parentElement.classList.remove('challenge-selected');
      radioButton.checked = false;
    });
  };

  const loadLayouts = async () => {
    let layouts = [];
    try {
      const response = await fetch('/api/layouts');
      layouts = await response.json();
    } catch {
      const layoutText = localStorage.getItem('layouts');
      if (layoutText) {
        layouts = JSON.parse(layoutText);
      }
    }

    displayLayouts(layouts);
  };

  const displayLayouts = (layouts) => {
    const tableBodyEl = document.querySelector('#layouts');

    if (layouts.length) {
      for (const [i, layout] of layouts.entries()) {
        const positionTdEl = document.createElement('td');
        positionTdEl.setAttribute('class', 'formatted-table');
        const nameTdEl = document.createElement('td');
        nameTdEl.setAttribute('class', 'player-name');
        const layoutTdEl = document.createElement('td');
        layoutTdEl.setAttribute('class', 'player-layout');
        const dateTdEl = document.createElement('td');
        dateTdEl.setAttribute('class', 'formatted-table');

        positionTdEl.textContent = i + 1;
        nameTdEl.textContent = layout.name;
        dateTdEl.textContent = layout.date;

        const challengeLink = document.createElement('a');
        challengeLink.setAttribute('href', 'play.html');
        challengeLink.setAttribute('class', 'challenge-link');
        challengeLink.textContent = 'Challenge!';

        challengeLink.addEventListener('click', () => {
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
  };

  const saveLayout = async (layoutToSave) => {
    const userName = localStorage.getItem('userName');
    const date = new Date().toLocaleDateString();
    const userLayout = layoutToSave;
    const newLayout = { name: userName, layout: userLayout, date: date };

    try {
      const response = await fetch('/api/layout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newLayout),
      });

      const layouts = await response.json();
      // localStorage.setItem('layouts', JSON.stringify(layouts));
    } catch {
      // Handle error
    }
  };

  return (
    <div>
      <header>
        <h1 id="headername">War Ships!</h1>
        <nav>
          <menu>
            <li className="jump-link"><a href="index.html">Home</a></li>
            <li className="jump-link"><a href="play.html">Play</a></li>
            <li className="jump-link"><a href="upLayout.html">Upload/Choose Layout</a></li>
            <li className="jump-link"><a href="about.html">About</a></li>
          </menu>
        </nav>
        <hr />
      </header>
      <main>
        <table>
          <thead>
            <tr className="formatted-table">
              <td className="formatted-table">#</td>
              <td className="formatted-table">Opponent's Name</td>
              <td className="formatted-table">Challenge!</td>
              <td className="formatted-table">Date Uploaded</td>
            </tr>
          </thead>
          <tbody id="layouts"></tbody>
        </table>
        <form id="button-form">
          <div>
            <table>
              {/* Rows of radio buttons */}
              {/* ... */}
            </table>
          </div>
          <button type="submit" id="submit-button">
            Submit
          </button>
          <button id="clear-button">Clear Selection</button>
        </form>
      </main>
      <footer>
        <hr />
        <span className="text-reset">Luke Dachenhausen</span>
        <br />
        <a href="https://github.com/Ldach/cs260-startup-example/tree/main">GitHub</a>
      </footer>
    </div>
  );
}

export default UpLayout;
