const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users'; 

// Fetch data from the API endpoint
async function fetchData() {
    try {
        const response = await fetch(USERS_ENDPOINT); // Fetch data
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`); // Throw error for non-OK responses
        }
        const json = await response.json(); // Parse JSON response
        return json; // Return the fetched data
    } catch (error) {
        console.error("Data fetching error:", error.message); // Log any fetching errors
        return []; // Return an empty array in case of error
    }
}

// Extract the Top Level Domain (TLD) from a website URL
function extractTLD(website) {
    if (!website) {
        console.error('Invalid website URL'); // Log if website URL is invalid
        return ''; // Return empty string for invalid URL
    }

    const splittedWebsite = website.split('.'); // Split URL by '.'
    if (splittedWebsite.length < 2) {
        console.error('Invalid website URL:', website); // Log if URL doesn't contain a domain
        return ''; // Return empty string
    }
    return splittedWebsite[splittedWebsite.length - 1]; // Return the last part of the domain
}

// Group users by their TLDs
function groupUsersByTLD(users) {
    const tlds = {}; // Create an empty object to store TLD groups
    if (!Array.isArray(users)) {
        console.error('Invalid input:', users, 'users must be an array'); // Log if input is not an array
        return tlds; // Return empty object
    }

    users.forEach((user) => {
        const tld = extractTLD(user.website); // Get the TLD from the user's website
        if (tld !== '') {
            // If TLD exists, group users by TLD
            if (!tlds[tld]) {
                tlds[tld] = []; // Create a new array for the TLD if it doesn't exist
            }
            tlds[tld].push(user); // Push the user into the corresponding TLD group
        }
    });

    return tlds; // Return the grouped users by TLD
}

// Create a paragraph element with the given text
function createParagraph(text) {
    if (typeof text !== 'string') {
        console.error('Invalid input: text', text, 'must be a string'); // Log if text is not a string
        return null; // Return null for invalid input
    }
    const paragraph = document.createElement('p'); // Create a paragraph element
    paragraph.textContent = text; // Set the text content
    return paragraph; // Return the paragraph element
}

// Create a card element for a user
function createCard(user) {
    if (!user || typeof user.name !== 'string' || typeof user.username !== 'string' || typeof user.website !== 'string') {
        console.error('Invalid user object:', user); // Log if the user object is invalid
        return null; // Return null for invalid user
    }

    const cardDiv = document.createElement('div'); // Create a card element
    cardDiv.classList.add('card'); // Add 'card' class to the card element

    // Create paragraphs for user details
    const nameP = createParagraph(`Name: ${user.name}`);
    const usernameP = createParagraph(`Username: ${user.username}`);
    const websiteP = createParagraph(`Website: ${user.website}`);

    // Append paragraphs to the card element
    if (nameP) cardDiv.appendChild(nameP);
    if (usernameP) cardDiv.appendChild(usernameP);
    if (websiteP) cardDiv.appendChild(websiteP);

    return cardDiv; // Return the card element
}

// Create a column element with the specified title
function createColumn(title) {
    if (typeof title !== 'string') {
        console.error('Invalid input: title', title, 'must be a string'); // Log if title is not a string
        return null; // Return null for invalid title
    }

    const columnDiv = document.createElement('div'); // Create a column element
    columnDiv.classList.add('column'); // Add 'column' class to the column element

    const h3 = document.createElement('h3'); // Create a heading element
    h3.textContent = '.' + title; // Set the title text

    columnDiv.appendChild(h3); // Append the title to the column div

    return columnDiv; // Return the column element
}

// Append a column element to the wrapper in the DOM
function appendElementToWrapper(columnDiv) {
    const wrapperDiv = document.getElementById('wrapper'); // Get the wrapper div
    if (!wrapperDiv) {
        console.error('Wrapper div not found'); // Log if wrapper div is not found
        return; // Exit if wrapper div doesn't exist
    }
    wrapperDiv.appendChild(columnDiv); // Append the column div to the wrapper
}

// Render a column with the given title and users
function renderColumn(title, users) { 
    const columnDiv = createColumn(title); // Create a column for the title

    if (!columnDiv) {
        console.error(`Error creating column for title: ${title}`); // Log if column creation fails
        return; // Exit if column creation fails
    }

    // Iterate through users and create cards
    users.forEach((user) => { 
        const cardDiv = createCard(user); // Create a card for the user
        if (cardDiv) {
            columnDiv.appendChild(cardDiv); // Append the card to the column div
        }
    });

    // Append the column to the DOM
    appendElementToWrapper(columnDiv);
}

// Render all TLD groups
function renderTLDGroups(tldGroups) {
    if (Object.keys(tldGroups).length === 0) {
        console.error('Invalid input: tldGroups must be a non-empty object'); // Log if input is empty
        return; // Exit if input is invalid
    }
    Object.keys(tldGroups).forEach((tld) => {
        renderColumn(tld, tldGroups[tld]); // Render each column for TLD groups
    });         
}

// Main function to orchestrate fetching and rendering
async function main() {
    const loadingIndicator = document.getElementById('loading'); // Get loading indicator
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block'; // Show loading indicator
    } else {
        console.error('loadingIndicator not found'); // Log if loading indicator is not found
    }

    try {
        const users = await fetchData(); // Fetch user data
        const tldGroups = groupUsersByTLD(users); // Group users by TLD
        renderTLDGroups(tldGroups); // Render the grouped users
    } finally {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none'; // Hide loading indicator
        }
    }
}

main();

// Export functions for testing purposes
if (typeof module !== 'undefined') module.exports = { 
    main, 
    fetchData, 
    extractTLD, 
    groupUsersByTLD, 
    createParagraph, 
    createCard, 
    appendElementToWrapper, 
    createColumn, 
    renderColumn, 
    renderTLDGroups 
};
