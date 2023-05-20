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
          Forgot Password Page
   *************************************/
  let password_form = document.querySelector('form[name=password_form]');
  if (password_form) { // in case we are not on the login page
    password_form.addEventListener('submit', (event) => {
      // Stop the default form behavior
      event.preventDefault();

      // Grab the needed form fields
      const action = password_form.getAttribute('action');
      const method = password_form.getAttribute('method');
      const data = Object.fromEntries(new FormData(password_form).entries());

      // Submit the POST request
      server_request(action, data, method, (response) => {
        alert(response.message);
        if (response.changed) {
          location.replace('/login');
        }
      });
    });
  }


  //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  // Handle Login POST Request
  //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  let login_form = document.querySelector('form[name=login_form]');
  if (login_form) { // in case we are not on the login page
    login_form.addEventListener('submit', (event) => {
      // Stop the default form behavior
      event.preventDefault();

      // Grab the needed form fields
      const action = login_form.getAttribute('action');
      const method = login_form.getAttribute('method');
      const data = Object.fromEntries(new FormData(login_form).entries());

      // Submit the POST request
      server_request(action, data, method, (response) => {
        alert(response.message);
        if (response.session_id != 0) {
          location.replace('/login');
        }
      });
    });
  }
  //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  // Handle Register POST Request
  //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  let register_form = document.querySelector('form[name=register_form]');
  if (register_form) { // in case we are not on the login page
    register_form.addEventListener('submit', (event) => {
      // Stop the default form behavior
      event.preventDefault();

      // Grab the needed form fields
      const action = register_form.getAttribute('action');
      const method = register_form.getAttribute('method');
      const data = Object.fromEntries(new FormData(register_form).entries());

      // Submit the POST request
      server_request(action, data, method, (response) => {
        alert(response.message);
        if (response.session_id != 0) {
          location.replace('/login');
        }
      });
    });
  }

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