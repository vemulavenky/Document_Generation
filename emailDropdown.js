import { GRAPH_API } from "../js/API/apiEndpoints.js";

async function fetchAllUsers(accessToken) {
  let users = [];
  let nextLink = GRAPH_API;

  try {
    while (nextLink) {
      const response = await fetch(nextLink, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error fetching user information.');
      }

      const data = await response.json();
      users = users.concat(data.value); 

      nextLink = data['@odata.nextLink'] || null; 
    }
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }

  return users;
}

async function fetchUserInformation(accessToken) {
  try {
    
    const users = await fetchAllUsers(accessToken);
    console.log('Fetched users:', users);

    const emailTextbox = document.getElementById('textbox1');
    const nameTextbox = document.getElementById('textbox3');
    const emailSuggestions = document.getElementById('suggestions-email');

    emailTextbox.addEventListener('input', function() {
      filterSuggestions(emailTextbox.value, users, emailSuggestions);
    });

    function filterSuggestions(query, users, suggestionsBox) {
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'none';

      if (query) {
        const filteredUsers = users.filter(user => user.mail && user.mail.toLowerCase().includes(query.toLowerCase()));
        
        const limitedUsers = filteredUsers.slice(0, 5); 

        if (limitedUsers.length > 0) {
          limitedUsers.forEach(user => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = user.mail;
            suggestionItem.addEventListener('click', function() {
              emailTextbox.value = user.mail;
              nameTextbox.value = user.displayName || ''; 
              suggestionsBox.style.display = 'none';
            });
            suggestionsBox.appendChild(suggestionItem);
          });
          suggestionsBox.style.display = 'block';
        } else {
          suggestionsBox.style.display = 'none';
        }
      } else {
        suggestionsBox.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    alert('An error occurred while fetching user information.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const accessToken = window.localStorage.getItem('accessToken');
  if (accessToken) {
    fetchUserInformation(accessToken);
  } else {
    console.error('Access token not found in localStorage.');
    alert('Access token is required to fetch user information.');
  }
});
