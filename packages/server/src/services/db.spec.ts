import { DBService } from './db';
const { v4: uuidv4 } = require('uuid');
let id = uuidv4(); // Generates a UUID


jest.mock('@azure/cosmos');

describe('DbService', () => {
    beforeAll(() => {
        // Set environment variables
        process.env.COSMOS_ENDPOINT = 'dummy';
        process.env.COSMOS_KEY = '123';

        // Mock the CosmosClient
        const { CosmosClient } = require('@azure/cosmos');
        CosmosClient.mockImplementation(() => {
            return {
                database: () => ({
                    container: () => ({
                        items: {
                            create: () => ({
                                resource: {
                                    id: '123',
                                    userId: '123',
                                    title: 'test',
                                    completed: false
                                }
                            }),
                            query: () => ({
                                fetchAll: () => ({
                                    resources: []
                                })
                            }),
                        },
                        item: () => ({
                            read: () => ({
                                resource: {
                                    id: '123',
                                    userId: '123',
                                    title: 'test',
                                    completed: false
                                }
                            }),
                            upsert: () => ({
                                resource: {
                                    id: '123',
                                    userId: '123',
                                    title: 'test',
                                    completed: true
                                }
                            }),
                            delete: () => ({})
                        }),
                    })
                })
            };
        });

    });


    it('should get all tasks for a user', async () => {
        const dbService = new DBService();
        const tasks = await dbService.getTasks('123');
        expect(tasks).toEqual([]);
    });

    it('should create a task', async () => {
        // write code here
        const dbService = new DBService();
        const task = await dbService.createTask({
            id: '123',
            userId: '123',
            title: 'test',
            completed: false
        });
        expect(task).toEqual({ 'completed': false, 'id': '123', 'title': 'test', 'userId': '123' });
    });

});


