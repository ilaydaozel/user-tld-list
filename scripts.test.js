const { main, fetchData, extractTLD, groupUsersByTLD, createParagraph, createCard, appendElementToWrapper, createColumn, renderColumn, renderTLDGroups } = require('./scripts.js');

// Mock global fetch
global.fetch = jest.fn();


describe('fetchData', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('should fetch user data and return JSON', async () => {
        // Mock successful fetch response
        fetch.mockResolvedValue({
            ok: true,
            json: async () => [{ id: 1, name: 'John Doe' }]
        });

        const data = await fetchData();
        expect(data).toEqual([{ id: 1, name: 'John Doe' }]);
    });

    it('should return an empty array when fetch fails', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => [],
        });

        const data = await fetchData();
        expect(data).toEqual([]);
    });

    it('should handle fetch errors gracefully', async () => {
        fetch.mockRejectedValue(new Error('Network Error'));

        const data = await fetchData();
        expect(data).toEqual([]);
    });
});

describe('extractTLD', () => {
    it('should return the TLD for a valid website URL', () => {
        expect(extractTLD('https://example.com')).toBe('com');
        expect(extractTLD('https://my.website.org')).toBe('org');
    });

    it('should return an empty string for an invalid website URL', () => {
        expect(extractTLD('invalid-url')).toBe('');
        expect(extractTLD('')).toBe('');
    });

    it('should handle edge cases', () => {
        expect(extractTLD('https://')).toBe('');
    });
});

describe('groupUsersByTLD', () => {
    it('should group users by their website TLD', () => {
        const users = [
            { name: 'User1', website: 'https://example.com' },
            { name: 'User2', website: 'https://test.org' },
            { name: 'User3', website: 'https://example.com' },
        ];
        const result = groupUsersByTLD(users);
        expect(result).toEqual({
            com: [{ name: 'User1', website: 'https://example.com' }, { name: 'User3', website: 'https://example.com' }],
            org: [{ name: 'User2', website: 'https://test.org' }]
        });
    });

    it('should return an empty object if users is not an array', () => {
        expect(groupUsersByTLD(null)).toEqual({});
    });
});

describe('createParagraph', () => {
    it('should create a paragraph element with the provided text', () => {
        const paragraph = createParagraph('Test paragraph');
        expect(paragraph.tagName).toBe('P');
        expect(paragraph.textContent).toBe('Test paragraph');
    });

    it('should return a text node when input is not a string', () => {
        const result = createParagraph(123);
        expect(result).toBe(null);
    });
});

describe('createCard', () => {
    it('should create a card for a valid user object', () => {
        const user = { name: 'User1', username: 'user1', website: 'https://example.com' };
        const card = createCard(user);
        expect(card).not.toBeNull();
        expect(card.classList.contains('card')).toBe(true);
        expect(card.querySelector('p').textContent).toBe('Name: User1');
    });

    it('should return null for an invalid user object', () => {
        const invalidUser = { name: 'User1' }; // Missing username and website
        console.error = jest.fn();
        const card = createCard(invalidUser);
        expect(card).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Invalid user object:', invalidUser);
    });
});

describe('createColumn', () => {
    it('should create a column element with the specified title', () => {
        const column = createColumn('domain');
        expect(column).not.toBeNull();
        expect(column.querySelector('h3').textContent).toBe('.domain');
    });

    it('should return null for an invalid title', () => {
        const invalidColumn = createColumn(123);
        expect(invalidColumn).toBeNull();
    });
});

describe('appendElementToWrapper', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="loading" style="display: none;">Loading...</div><div id="wrapper"></div>';
    });

    it('should append a columnDiv to the wrapper', () => {
        const columnDiv = createColumn('Test Column');
        appendElementToWrapper(columnDiv);
        const wrapper = document.getElementById('wrapper');
        expect(wrapper.children.length).toBe(1);
    });

    it('should log an error if wrapper div is not found', () => {
        document.body.innerHTML = '';
        console.error = jest.fn();
        appendElementToWrapper(createColumn('Test Column'));
        expect(console.error).toHaveBeenCalledWith('Wrapper div not found');
    });
})


describe('renderColumn', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="loading" style="display: none;">Loading...</div><div id="wrapper"></div>';
    });

    it('should render a column with user cards', () => {
        const users = [
            { name: 'User1', username: 'user1', website: 'https://example.com' },
            { name: 'User2', username: 'user2', website: 'https://example.org' },
        ];
        const columnTitle = 'domain';
        renderColumn(columnTitle, users);
        const columnDiv = document.querySelector('.column');
        expect(columnDiv).not.toBeNull();
        expect(columnDiv.querySelector('h3').textContent).toBe('.' + columnTitle);
        expect(columnDiv.querySelectorAll('.card').length).toBe(2);
    });

    it('should handle the case when createColumn returns null', () => {
        console.error = jest.fn(); // Mock console.error
        renderColumn(null, []);
        expect(console.error).toHaveBeenCalledWith('Error creating column for title: null');
    });
});

describe('renderTLDGroups', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="loading" style="display: none;">Loading...</div><div id="wrapper"></div>';
    });
    
    it('should render columns for each TLD group', () => {
        const tldGroups = {
            com: [{ name: 'User1', username: 'user1', website: 'https://example.com' }],
            org: [{ name: 'User2', username: 'user2', website: 'https://example.org' }],
        };
        renderTLDGroups(tldGroups);
        expect(document.querySelectorAll('.column').length).toBe(2); // One for each TLD
    });

    it('should log an error for an empty tldGroups', () => {
        console.error = jest.fn(); // Mock console.error
        renderTLDGroups({});
        expect(console.error).toHaveBeenCalledWith('Invalid input: tldGroups must be a non-empty object');
    });
});

describe('main', () => {
    let loadingIndicator;

    beforeEach(() => {
        // Setup the DOM with a loading indicator
        document.body.innerHTML = '<div id="loading" style="display: none;">Loading...</div>';
        loadingIndicator = document.getElementById('loading');
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear any previously set mocks after each test
    });

    it('should show and hide loading indicator', async () => {
        // Mock fetchData, groupUsersByTLD, and renderTLDGroups
        const fetchData = jest.fn().mockResolvedValue([{ name: 'User1', website: 'https://example.com' }]);
        const groupUsersByTLD = jest.fn().mockReturnValue({ com: [{ name: 'User1', website: 'https://example.com' }] });
        const renderTLDGroups = jest.fn();

        // Call the main function
        await main(fetchData, groupUsersByTLD, renderTLDGroups);

        // Verify loading indicator is hidden after the function completes
        expect(loadingIndicator.style.display).toBe('none');
    });
});
