interface Task<T = unknown> {
  tasks: Array<() => Promise<T>>;
  limit: number;
}

export async function* batchTasks<T = unknown>({ tasks, limit }: Task<T>) {
  // iterate over tasks
  for (let i = 0; i < tasks.length; i = i + limit) {
    // grab the batch of tasks for current iteration
    const batch = tasks.slice(i, i + limit);
    // wait for them to resolve concurrently
    const result = await Promise.allSettled(batch.map((task) => task()));
    // yield the batched result and let consumer know
    yield result;
  }
}
