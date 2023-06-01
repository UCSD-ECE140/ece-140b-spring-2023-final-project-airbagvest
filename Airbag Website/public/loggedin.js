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