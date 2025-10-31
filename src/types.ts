export interface Task {
    id: string,
    title: string,
    done: boolean,
    appKey: string
}

export type TaskFilter = "all" | "todo" | "done";