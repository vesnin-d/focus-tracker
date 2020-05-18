const API_URL = 'http://localhost:8080/graphql'

export async function login(email: string, password: string) {
    // Fetch data from GitHub's GraphQL API:
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query {
            login(email: "${email}", password: "${password}") {
              token,
              userId
            }
          }`
        }),
      });

    // Get the response as JSON
    return await response.json();
}

export async function fetchGraphQL(text: string, token: string, variables?: any) {
    // Fetch data from GitHub's GraphQL API:
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: text,
        variables,
      }),
    });
  
    // Get the response as JSON
    return await response.json();
}  

export async function fetchTimer(id: string, token: string) {
    console.log(id);
    return fetchGraphQL(
        `query {
            timer(id: "${id}") {
              _id,
              startedAt,
              remains,
              resumedAt,
              isRunning
            }
        }`,
        token
    );
}

export async function createTimer(startedAt: number, token: string) {
  return fetchGraphQL(
      `mutation {
          createTimer(startTime: ${startedAt}) {
            _id,
            startedAt,
            remains,
            resumedAt,
            isRunning
          }
      }`,
      token
  );
}

export async function pauseTimer(id: string, token: string) {
  console.log(id);
  return fetchGraphQL(
      `mutation {
          pauseTimer(id: "${id}") {
            _id,
            startedAt,
            remains,
            resumedAt,
            isRunning
          }
      }`,
      token
  );
}

export async function resumeTimer(id: string, token: string) {
  return fetchGraphQL(
      `mutation {
          resumeTimer(id: "${id}") {
              _id,
              startedAt,
              remains,
              resumedAt,
              isRunning
          }
      }`,
      token
  );
}
