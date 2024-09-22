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
    if (!website) {
        console.error('Invalid website URL');
        return ''; // Handle invalid URL case
    }

    // Parse the website
    const splittedWebsite = website.split('.');
    if (splittedWebsite.length < 2) {
        console.error('Invalid website URL:', website);
        return ''; // If it doesn't contain a domain then return empty string
    }
    // Return the last part of the domain
    return splittedWebsite[splittedWebsite.length - 1];
}

// Group users by TLD
function groupUsersByTLD(users) {
    const tlds = {}; // Create an empty object to store TLD groups
    if (!Array.isArray(users)) {
        console.error('Invalid input:', users, 'users must be an array');
        return tlds; // Handle invalid input case
    }

    users.forEach((user) => {
        // Get the top-level domain of the website
        const tld = extractTLD(user.website);
        if (tld !== '') {
            // Check if the TLD key already exists, otherwise create it
            if (!tlds[tld]) {
                tlds[tld] = [];
            }
            tlds[tld].push(user);
        }
    });

    return tlds; // Return the grouped users by TLD
}

function createParagraph(text) {
    if (typeof text !== 'string') {
        console.error('Invalid input: text', text, 'must be a string');
        return null;
    }
    const paragraph = document.createElement('p'); 
    paragraph.textContent = text; 
    return paragraph;
}

function createCard(user) {
    // Check if the user object is valid
    if (!user || typeof user.name !== 'string' || typeof user.username !== 'string' || typeof user.website !== 'string') {
        console.error('Invalid user object:', user);
        return null;
    }
    // Create card element
    const cardDiv = document.createElement('div'); 
    cardDiv.classList.add('card'); 

    // Create paragraphs
    const nameP = createParagraph(`Name: ${user.name}`); 
    const usernameP = createParagraph(`Username: ${user.username}`); 
    const websiteP = createParagraph(`Website: ${user.website}`);

    // Append paragraphs to the card element
    cardDiv.appendChild(nameP); 
    if (nameP) cardDiv.appendChild(nameP);
    if (usernameP) cardDiv.appendChild(usernameP); 
    if (nameP) cardDiv.appendChild(websiteP); 

    return cardDiv;  // Return the card element for further usage in column rendering
}

function createColumn(title) {
    if (typeof title !== 'string') {
        console.error('Invalid input: title', title, 'must be a string');
        return null;
    }
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

function appendElementToWrapper(columnDiv) {
    // Get the wrapper div
    const wrapperDiv = document.getElementById('wrapper');
    if (!wrapperDiv) {
        console.error('Wrapper div not found');
        return;
    }
    wrapperDiv.appendChild(columnDiv); 
}

function renderColumn(title, users) { 
    const columnDiv = createColumn('.' + title);

    if (!columnDiv) {
        console.error(`Error creating column for title: ${title}`);
        return;
    }

    // Iterate through users
    users.forEach((user) => { 
        const cardDiv = createCard(user);
        if (cardDiv) {
            columnDiv.appendChild(cardDiv); 
        }
    });

    // Append element to the DOM
    appendElementToWrapper(columnDiv);
}

// Render each TLD group
function renderTLDGroups(tldGroups) {
    if (Object.keys(tldGroups).length === 0) {
        console.error('Invalid input: tldGroups must be a non-empty object');
        return; // Handle invalid input case
    }
    Object.keys(tldGroups).forEach((tld) => {
        renderColumn(tld, tldGroups[tld]);
    });
}

async function main() {
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.style.display = 'block';

    try {
        const users = await fetchData();
        const tldGroups = groupUsersByTLD(users);
        renderTLDGroups(tldGroups);
    } catch (error) {
        console.error('Error in main function:', error);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

main();

module.exports = { fetchData, extractTLD, groupUsersByTLD, createParagraph, createCard, appendElementToWrapper, createColumn, renderColumn, renderTLDGroups };