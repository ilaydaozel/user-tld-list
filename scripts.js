async function fetchData() {
    const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users'; 
    try {
        // Fetch data from the API endpoint
        const response = await fetch(USERS_ENDPOINT);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json; // Return the fetched data
    } catch (error) {
        console.error(error.message);
        return []; // Return an empty array in case of error
    }
}

// Parse the TLD (Top Level Domain) from the website URL
function extractTLD(website) {
    if (!website) return '';
    try {
        // Parse the website
        const splittedWebsite = website.split('.');
        if (splittedWebsite.length < 2) {
            return ''; // If it doesn't contain a domain then return empty string
        }
        // Return the last part of the domain
        return splittedWebsite[splittedWebsite.length - 1];
    } catch (error) {
        console.error(`Error extracting TLD: ${website}`, error);
        return ''; // Handle invalid URL case
    }
}

// Sort data by TLD type and group users by TLD
function sortUsersByTLD(users) {
    const tlds = {}; // Create an empty object to store TLD groups
    users.forEach((user) => {
        // Get the top-level domain of the website
        const tld = extractTLD(user.website);
        if(tld != '') {
            // Check if the TLD key already exists, otherwise create it
            if (!tlds[tld]) {
                tlds[tld] = [];
            }
        }
        // Push the user into the TLD group
        tlds[tld].push(user);
    });

    return tlds; // Return the grouped users by TLD
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

async function main() {
    users = await fetchData();
    console.log(sortUsersByTLD(users))
}

main()