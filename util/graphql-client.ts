
interface MagentoGraphQLResponse<T> {
    data: T;
    errors?: Array<{ message: string }>;
}

export async function fetchGraphQL<T>(
    url: string,
    query: string,
    variables?: Record<string, any>
): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const json: MagentoGraphQLResponse<T> = await response.json();

    if (json.errors) {
        throw new Error(`GraphQL Errors: ${json.errors.map((e) => e.message).join(', ')}`);
    }

    return json.data;
}
