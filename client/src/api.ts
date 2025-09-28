// src/api.ts
export enum Status {
  Todo = 0,
  InProgress = 1,
  Done = 2,
}

export interface TaskItem {
  id: number;
  title: string;
  description?: string | null;
  status: Status;
}

export interface TaskCreateDto {
  title: string;
  description?: string | null;
  status: Status;
}

export interface TaskUpdateDto extends TaskCreateDto {}

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const handle = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
};

export const getTasks = async (): Promise<TaskItem[]> => {
  const res = await fetch(`${BASE_URL}/api/tasks`);
  return handle<TaskItem[]>(res);
};

export const getTask = async (id: number): Promise<TaskItem> => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`);
  return handle<TaskItem>(res);
};

export const createTask = async (dto: TaskCreateDto): Promise<TaskItem> => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return handle<TaskItem>(res);
};

export const updateTask = async (id: number, dto: TaskUpdateDto): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
};

export const deleteTask = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
};