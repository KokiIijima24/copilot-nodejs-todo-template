// Import cosmos SDK and task model
import { CosmosClient } from '@azure/cosmos';

// Create a DBService class to wrap the cosmos SDK
// connectiong to the 'todos' database and 'task' container
// and with CRUD methods fro task
export class DBService {
  private client: CosmosClient;
  private database: any;
  private container: any;

  constructor() {
    this.client = new CosmosClient({
      endpoint:'',
      key: '',
    });
    this.database = this.client.database('todos');
    this.container = this.database.container('task');
  }

  async getTasks() {
    const querySpec = {
      query: 'SELECT * from c',
    };
    const { resources: results } = await this.container.items
      .query(querySpec)
      .fetchAll();
    return results;
  }

  async getTask(id: string) {
    const { resource: result } = await this.container.item(id).read();
    return result;
  }

  async createTask(task: any) {
    const { resource: result } = await this.container.items.create(task);
    return result;
  }

  async updateTask(id: string, task: any) {
    const { resource: result } = await this.container
      .item(id)
      .replace(task, { accessCondition: { type: 'IfMatch', condition: task._etag } });
    return result;
  }

  async deleteTask(id: string) {
    const { resource: result } = await this.container.item(id).delete();
    return result;
  }
}
