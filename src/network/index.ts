import { fetchGraphQL, API_URL, getGraphQLResponseHandler } from './utils';

const Queries = {
    Login: `query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token,
            userId
        }
    }`,
    CurrentUser: `{
        user {
            id,
            email,
            tasks {
                id,
                title,
                timeRecords {
                    duration
                }
            }
        }
    }`
};

const Mutations = {
    CreateTask: `mutation CreateTask($title: String!) {
        addTask(title: $title) {
            id,
            title,
            isCompleted
        }
    }`,
    CompleteTask: `mutation MarkTaskCompleted($taskId: ID!) {
        completeTask(id: $taskId) {
            id,
            title,
            isCompleted
        }
    }`,
    CreateTimeRecord: `mutation CreateTimeRecord($duration: Int!, $taskId: ID) {
        addTimeRecord(duration: $duration, taskId: $taskId) {
            id,
            duration,
            task {
                id,
                title,
                isCompleted,
                timeRecords {
                    duration
                }
            }
        }
    }`,
    UpdateTimeRecordDuration: `mutation UpdateTimeRecordDuration($id: ID!, $duration: Int!) {
        updateTimeRecordDuration(timeRecordId: $id, newDuration: $duration) {
            id,
            duration
        }
    }`
};

export async function login(email: string, password: string) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: Queries.Login,
            variables: { email, password },
        }),
    });

    return await response.json()
        .then(getGraphQLResponseHandler('login'));
}

export function fetchCurrentUser(token: string) {
    return fetchGraphQL(Queries.CurrentUser, token)
        .then(getGraphQLResponseHandler('user'));
}

export function createTask(title: string, token: string) {
    return fetchGraphQL(Mutations.CreateTask, token, { title })
        .then(getGraphQLResponseHandler('addTask'));
}

export function markTaskCompleted(taskId: string, token: string) {
    return fetchGraphQL(Mutations.CompleteTask, token, { taskId })
        .then(getGraphQLResponseHandler('completeTask'));
}

export function createTimeRecord(duration: number, taskId: string | null, token?: string) {
    return fetchGraphQL(Mutations.CreateTimeRecord, token!, { duration, taskId })
        .then(getGraphQLResponseHandler('addTimeRecord'));
}

export function updateTimeRecordDuration(id: string, duration: number, token: string) {
    return fetchGraphQL(Mutations.UpdateTimeRecordDuration, token, { id, duration })
        .then(getGraphQLResponseHandler('updateTimeRecordDuration'));
}
