const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users'; 

async function fetchData() {
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

// Group users by TLD
function groupUsersByTLD(users) {
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

function createParagraph(text) {
    const paragraph = document.createElement('p'); 
    paragraph.textContent = text; 
    return paragraph;
}

function createCard(user) {
    // Create card element
    const cardDiv = document.createElement('div'); 
    cardDiv.classList.add('card'); 

    // Create paragraphs
    const nameP = createParagraph(`Name: ${user.name}`); 
    const usernameP = createParagraph(`Username: ${user.username}`); 
    const websiteP = createParagraph(`Website: ${user.website}`);

    // Append paragraphs to the card element
    cardDiv.appendChild(nameP); 
    cardDiv.appendChild(usernameP); 
    cardDiv.appendChild(websiteP); 

    return cardDiv;  // Return the card element for further usage in column rendering
}

function createColumn(title) {
    // Create column element
    const columnDiv = document.createElement('div'); 
    columnDiv.classList.add('column'); 

    // Create column title
    const h3 = document.createElement('h3'); 
    h3.textContent = title; 

    // Append column title to the column div
    columnDiv.appendChild(h3); 

    return columnDiv; // Return the column element for further usage in column rendering
}

function appendElementToWrapper() {
    // Get the wrapper div
    const wrapperDiv = document.getElementById('wrapper');
    wrapperDiv.appendChild(columnDiv); 
}

function renderColumn(title, users) { 
    const columnDiv = createColumn(title);

    // Iterate through users
    users.forEach((user) => { 
        cardDiv = createCard(user)
        // Put the card to the column div
        columnDiv.appendChild(cardDiv); 
    }); 

    // Append element to the dom
    appendElementToWrapper(columnDiv);
}


// Render each TLD group
function renderTLDGroups(tldGroups) {
    Object.keys(tldGroups).forEach((tld) => {
        renderColumn(tld, tldGroups[tld]);
    })
}

async function main() {
    const users = await fetchData();
    const tldGroups = groupUsersByTLD(users)
    renderTLDGroups(tldGroups);
}

main()