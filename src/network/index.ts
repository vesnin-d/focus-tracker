import { fetchGraphQL, API_URL } from './utils';

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
                title
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
            tasks
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
    // Fetch data from GitHub's GraphQL API:
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

    // Get the response as JSON
    return await response.json();
}

export function fetchCurrentUser(token: string) {
    return fetchGraphQL(Queries.CurrentUser, token).then(({ data, errors }) => {
        if (data) {
            return data.user;
        }

        throw errors[0];
    });
}

export function createTask(title: string, token: string) {
    return fetchGraphQL(Mutations.CreateTask, token, { title }).then(
        ({ data, errors }) => {
            if (data) {
                return data.addTask;
            }

            throw errors;
        }
    );
}

export function markTaskCompleted(taskId: string, token: string) {
    return fetchGraphQL(Mutations.CompleteTask, token, { taskId }).then(
        ({ data, errors }) => {
            if (data) {
                return data.completeTask;
            }

            throw errors;
        }
    );
}

export function createTimeRecord(duration: number, taskId?: string, token?: string) {
    console.log(taskId);
    return fetchGraphQL(Mutations.CreateTimeRecord, token!, { duration, taskId }).then(
        ({ data, errors }) => {
            if (data) {
                return data.addTimeRecord;
            }

            throw errors;
        }
    );
}

export function updateTimeRecordDuration(id: string, duration: number, token: string) {
    return fetchGraphQL(Mutations.UpdateTimeRecordDuration, token, { id, duration }).then(
        ({ data, errors }) => {
            if (data) {
                return data.updateTimeRecordDuration;
            }

            throw errors;
        }
    );
}
