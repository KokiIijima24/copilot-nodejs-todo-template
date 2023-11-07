// Import cosmos SDK and task model
import { CosmosClient } from '@azure/cosmos';
import { Task } from '../models/task';

// Create a DBService class to wrap the cosmos SDK
// connectiong to the 'todos' database and 'task' container
// and with CRUD methods fro task
export class DBService {
  private client: CosmosClient;
  private database: any;
  private container: any;

  constructor() {
    // Check if environment variables are set
    if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY) {
      throw new Error('Missing COSMOS_ENDPOINT or COSMOS_KEY environment variable');
    }
    this.client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY,
    });
    this.database = this.client.database('todos');
    this.container = this.database.container('task');
  }

  // Create a new task
  async createTask(task: Task): Promise<Task> {
    // Create a new task in the database
    const { resource: createdItem } = await this.container.items.create(task);

    // Return the new task
    return createdItem;
  }

  // Get a task by id
  async getTask(id: string): Promise<Task> {
    // Get the task from the database
    const { resource: task } = await this.container.item(id).read();

    // Return the task
    return task;
  }

  // Get all tasks for a user
  async getTasks(userId: string): Promise<Task[]> {
    // Get the tasks from the database
    const { resources: tasks } = await this.container
      .items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }]
      })
      .fetchAll();

    // Return the tasks
    return tasks;
  }

  // Update a task
  async updateTask(task: Task): Promise<Task> {
    // Update the task in the database
    const { resource: updatedItem } = await this.container
      .item(task.id)
      .replace(task);

    // Return the updated task
    return updatedItem;
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    // Delete the task from the database
    await this.container.item(id).delete();
  }
}
