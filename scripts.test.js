const { extractTLD, groupUsersByTLD, createParagraph, fetchData } = require('./scripts.js');

// Mock global fetch
global.fetch = jest.fn();

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
