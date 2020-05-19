export const API_URL = 'http://localhost:8080/graphql'

export async function fetchGraphQL(query: string, token: string, variables?: any) {
    // Fetch data from GitHub's GraphQL API:
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