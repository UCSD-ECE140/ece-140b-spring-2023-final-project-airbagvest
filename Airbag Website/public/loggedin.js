document.addEventListener("DOMContentLoaded", () => {

  //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  // Define the 'request' function to handle interactions with the server
  function server_request(url, data = {}, verb, callback) {
    return fetch(url, {
      credentials: 'same-origin',
      method: verb,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(response => {
        if (callback)
          callback(response);
      })
      .catch(error => console.error('Error:', error));
  }

  /*************************************
            Profile Page
   *************************************/

  let edit_user = document.querySelector('form[name=edit_user]');
  if (edit_user) { // in case we are not on the profile page
    edit_user.addEventListener('submit', (event) => {
      // Stop the default form behavior
      event.preventDefault();

      // Grab the needed form fields
      const action = edit_user.getAttribute('action');
      const method = edit_user.getAttribute('method');
      const data = Object.fromEntries(new FormData(edit_user).entries());

      // Submit the POST request
      server_request(action, data, method, (response) => {
        alert(response.message);
        if (response.changed) {
          location.replace('/profile');
        }
      });
    });
  }
  /*************************************
                MVP Page
   *************************************/
  var currentWeek = 1;

  // Handle left button
  let left_button = document.querySelector('#left_button');
  if (left_button) { // in case we are not on the login page
    left_button.addEventListener('click', (event) => {
      // Submit the POST request
      var idFirst = "#Week" + currentWeek;
      document.querySelector(`${idFirst}`).style.display = "none";
      currentWeek -= 1;
      if (currentWeek <= 0) {
        currentWeek = 1;
      }
      var idSecond = "#Week" + currentWeek;
      document.querySelector(`${idSecond}`).style.display = "block";
    });
  }

  // Handle right button
  let right_button = document.querySelector('#right_button');
  if (right_button) { // in case we are not on the login page
    right_button.addEventListener('click', (event) => {
      // Submit the POST request
      var idFirst = "#Week" + currentWeek;
      disappearWeek = document.querySelector(`${idFirst}`);
      disappearWeek.style.display = "none";
      currentWeek += 1;
      if (currentWeek >= 4) {
        currentWeek = 3;
      }
      var idSecond = "#Week" + currentWeek;
      appear = document.querySelector(`${idSecond}`);
      appear.style.display = "block";
    });
  }

  /*************************************
          Logout (across all pages)
   *************************************/
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