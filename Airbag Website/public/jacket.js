document.addEventListener("DOMContentLoaded", (event) => {

  // Define the 'request' function to handle interactions with the server
  function server_request(url, data = {}, verb, callback) {
    return fetch(url, {
      credentials: 'same-origin',
      method: verb,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => response.json())
      .then(function (response) {
        if (callback)
          callback(response);
      })
      .catch(error => console.error('Error:', error));
  }

  var leadContainer = document.querySelector("#lcontain");
  var comContainer = document.querySelector("#ccontain");
  var addForm = document.querySelector("#add_form");
  var teams = [];
  var teamViews = [];
  var commentViews = [];

  addForm.addEventListener('submit', (event) => {
    // Stop the default form behavior
    event.preventDefault();
    // Grab the needed form fields
    const action = addForm.getAttribute('action');
    const method = addForm.getAttribute('method');
    var data = {
      "battery": 100,
      "pressurized": false
    }
    console.log(data);
    server_request(action, data, method, (response) => {
      alert(response.message);
      showUserAirbags();
    });
  });


  /* TODO
  */
  function showUserAirbags() {
    leadContainer.innerHTML = `Loading...`;
    comContainer.innerHTML = `Choose an airbag to see extra details!`;
    fetch(`http://localhost:6543/airbags/user`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
      })
      .then(async (dataHold) => {
        if (dataHold.length <= 0) {
          return {};
        }
        var dataIndex = 0
        leadContainer.innerHTML = ``;
        console.log(dataHold)
        // go through dataHold put in teams?
        for (var data in dataHold) {
          if (dataIndex > dataHold.length - 1) {
            break;
          }
          // Display MVP Ideas
          var teamInfo = document.createElement("div");
          //show teams and ideas w/ section 
          // add 
          teamInfo.innerHTML = `
            <h2 class="id" style="display: none;">${dataHold[dataIndex][0]}</h2>
            <h2>Airbag Name: Placeholder</h2>
            <span>Battery: </span>
            <span class="battery">${dataHold[dataIndex][1]}</span>
            <div></div>
            <span>Pressurized: </span>
            <span class="pressurized">${Boolean(dataHold[dataIndex][2])}</span>
            <div></div>
            <button class="remove link" action="http://localhost:6543/deleteAirbag" method="DELETE">
              Remove 
            </button>
            `;

          leadContainer.appendChild(teamInfo);
          teamViews.push(teamInfo);
          dataIndex++;
          teamInfo.querySelector(".remove").addEventListener("click", (event) => {
            parent = event.currentTarget.parentElement;
            const action = event.currentTarget.getAttribute('action');
            const method = event.currentTarget.getAttribute('method');
            idBox = teamInfo.querySelector(".id");
            const data = { "airbag_id": idBox.innerHTML };
            server_request(action, data, method, () => {
              console.log("oh no")
            });
            parent.innerHTML = ``
          });
        }
      })
      .catch(error => console.error('Error:', error));
  }
  showUserAirbags();

  // Handle logout POST request
  let logout = document.querySelector('.logout_button');
  if (logout) {
    logout.addEventListener('click', (event) => {
      // Submit the POST request
      server_request('/logout', {}, 'POST', (response) => {
        if (response.session_id == 0) {
          location.replace('/login');
        }
      });

    });
  }
});

