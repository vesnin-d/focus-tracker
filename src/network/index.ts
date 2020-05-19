import { fetchGraphQL, API_URL } from './utils';

const LOGIN_QUERY = `query Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token,
    userId
  }
}`;

const CURRENT_USER_QUERY = `{
  user {
    _id,
    email
  }
}`;

const CREATE_TASK_MUTATION = `mutation CreateTask($title: String!) {
  addTask(title: $title) {
    _id,
    title,
    isCompleted
  }
}`;

const COMPLETE_TASK_MUTATION = `mutation MarkTaskCompleted($taskId: ID!) {
  completeTask(id: $taskId) {
    _id,
    title,
    isCompleted
  }
}`;

export async function login(email: string, password: string) {
    // Fetch data from GitHub's GraphQL API:
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: LOGIN_QUERY,
          variables: { email, password }
        }),
      });

    // Get the response as JSON
    return await response.json();
} 

export function fetchCurrentUser(token: string) {
  return fetchGraphQL(
    CURRENT_USER_QUERY,
    token
  ).then(({ data, errors}) => {
    if(data) {
      return data.user;
    }

    throw errors[0];
  });
}

export function createTask(title: string, token: string) {
  return fetchGraphQL(
    CREATE_TASK_MUTATION,
    token,
    { title }
  ).then(({ data, errors}) => {
    if(data) {
      return data.addTask;
    }

    throw errors;
  });
}

export function markTaskCompleted(taskId: string, token: string) {
  return fetchGraphQL(
    COMPLETE_TASK_MUTATION,
    token,
    { taskId }
  ).then(({ data, errors}) => {
    if(data) {
      return data.markTaskCompleted;
    }

    throw errors;
  });
}
