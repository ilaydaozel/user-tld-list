async function getData() {
    const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users'; 
    try {
      // Fetch data from the API endpoint
      const response = await fetch(USERS_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
}

function renderColumn(title, users) { 
    // Create column
    const columnDiv = document.createElement('div'); 
    columnDiv.classList.add('column'); 
    // Create column title
    const h3 = document.createElement('h3'); 
    h3.textContent = title; 
    columnDiv.appendChild(h3); 

    // Iterate through users
    users.forEach((user) => { 
        // Create card for a user
        const cardDiv = document.createElement('div'); 
        cardDiv.classList.add('card'); 
        // Name text
        const nameP = document.createElement('p'); 
        nameP.textContent = `Name: ${user.name}`; 
        cardDiv.appendChild(nameP); 
        // Username text
        const usernameP = document.createElement('p'); 
        usernameP.textContent = `Username: ${user.username}`; 
        cardDiv.appendChild(usernameP); 
        // Website text
        const websiteP = document.createElement('p'); 
        websiteP.textContent = `Website: ${user.website}`; 
        cardDiv.appendChild(websiteP); 
        // Put the card to the column div
        columnDiv.appendChild(cardDiv); 
    }); 
    // Wrap the column
    const wrapperDiv = document.getElementById('wrapper'); 
    wrapperDiv.appendChild(columnDiv); 
}
getData();