export const API_URL = `${process.env.REACT_APP_API_URL}/graphql`;

export async function fetchGraphQL(
    query: string,
    token: string,
    variables?: any
) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    // Get the response as JSON
    return await response.json();
}

export function getGraphQLResponseHandler(queryName: string) {
    return ({ data, errors}: any) => {
        if(data) {
            return data[queryName];
        }

        throw errors;
    };
}
