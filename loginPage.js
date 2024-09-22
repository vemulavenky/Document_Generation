import { USER_INFO_DETAILS } from "../js/API/apiEndpoints.js";


/*const msalConfig = {
  auth: {
    clientId: '14915922-52c0-4158-9f88-f8fcf1953cb4', 
    authority: 'https://login.microsoftonline.com/1ef6ba5f-c316-4061-b2bd-dad054ac56d9', 
    redirectUri: 'http://localhost:8000/frontend/Filenumbergenerator.html',
  },
  cache: {
    cacheLocation: "localStorage", 
  },
};
*/

const msalConfig = {
  auth: {
    clientId: '5122601e-794a-4ffc-94b0-e2b5a7d5a40f',
    authority: 'https://login.microsoftonline.com/544ac80a-dd11-49de-bd90-692127c9bff6',
    redirectUri: 'http://localhost:8000/frontend/Filenumbergenerator.html', 
  },
  cache: {
    cacheLocation: "localStorage", 
  },
};



const msalInstance = new msal.PublicClientApplication(msalConfig);

const loginRequest = {
  scopes: ['User.Read'], 
};

document.getElementById('loginButton').addEventListener('click', async function () { 
  try {
    const loginResponse = await msalInstance.loginPopup(loginRequest);
    console.log('Login Response:', loginResponse);

    if (loginResponse.account) {
      msalInstance.setActiveAccount(loginResponse.account);

      const fullName = loginResponse.account.name || "Unknown User";
      const email = loginResponse.account.username || "No email provided";
      window.localStorage.setItem('userFullName', fullName);
      window.localStorage.setItem('userEmail', email);

      try {
        const tokenResponse = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: msalInstance.getActiveAccount() 
        });
        console.log('Silent Token Response:', tokenResponse);
        window.localStorage.setItem('accessToken', tokenResponse.accessToken);
      } catch (silentError) {
        console.error('Silent token acquisition failed, acquiring token via popup.', silentError);
        const tokenResponse = await msalInstance.acquireTokenPopup(loginRequest);
        console.log('Popup Token Response:', tokenResponse);
        window.localStorage.setItem('accessToken', tokenResponse.accessToken);
      }

      showUserProfile(loginResponse.account);

      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(`${USER_INFO_DETAILS}/${encodedEmail}`, { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        const data = await response.json();
        if (data.status_message === 'SUCCESS') {
          window.localStorage.setItem('userRole', data.data.role);
        } else {
          window.localStorage.setItem('userRole', 'Normal');
        }

        setTimeout(() => {
          window.location.href = 'Filenumbergenerator.html';
        }, 1500);
        
      } catch (error) {
        console.error('Error validating user:', error);
        alert('An error occurred while validating your credentials.');
      }
    } else {
      console.error('No account information found in login response.');
      alert('Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert(`Login failed with error: ${error.message}`); // Fixed backticks for template literal
  }
});

function showUserProfile(account) {
  const content = document.getElementById('loginContent');
  if (content) {
    content.innerHTML = `<h2>Welcome, ${account.name || "User"}</h2>`; // Fixed missing backticks for template literal
  } else {
    console.error('Login content element not found.');
  }
}
