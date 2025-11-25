import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGraphQL } from '../util/graphql-client';

// Mock the global fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('fetchGraphQL', () => {
    beforeEach(() => {
        fetchMock.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return data when the request is successful', async () => {
        const mockData = { products: { items: [] } };
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({ data: mockData }),
        });

        const result = await fetchGraphQL('https://example.com/graphql', 'query {}');
        expect(result).toEqual(mockData);
        expect(fetchMock).toHaveBeenCalledWith('https://example.com/graphql', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ query: 'query {}' }),
        }));
    });

    it('should throw an error when the network response is not ok', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            statusText: 'Not Found',
        });

        await expect(fetchGraphQL('https://example.com/graphql', 'query {}'))
            .rejects.toThrow('Network response was not ok: Not Found');
    });

    it('should throw an error when the GraphQL response contains errors', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            json: async () => ({
                data: null,
                errors: [{ message: 'Syntax Error' }],
            }),
        });

        await expect(fetchGraphQL('https://example.com/graphql', 'query {}'))
            .rejects.toThrow('GraphQL Errors: Syntax Error');
    });
});
