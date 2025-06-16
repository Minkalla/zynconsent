    import express from 'express';
    import { Request, Response } from 'express';
    import bodyParser from 'body-parser';
    import swaggerUi from 'swagger-ui-express';
    import swaggerJsdoc from 'swagger-jsdoc';
    import { Server } from 'http'; // Import Server type for explicit typing

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());

    // --- In-memory Data Storage (for MVP only) ---
    // Using Record<string, ConsentEvent[]> to explicitly type the userConsentStore
    const userConsentStore: Record<string, ConsentEvent[]> = {};

    /**
     * @typedef {object} ConsentEvent
     * @property {string} userId - Unique identifier for the user.
     * @property {string} consentType - Type of consent (e.g., 'marketing', 'analytics', 'data_sharing').
     * @property {'granted' | 'revoked'} status - Status of the consent: 'granted' or 'revoked'.
     * @property {string} timestamp - ISO 8601 formatted timestamp of the consent event.
     */
    export interface ConsentEvent {
        userId: string;
        consentType: string;
        status: 'granted' | 'revoked';
        timestamp: string;
    }

    app.post('/consent', (req: Request<{}, {}, ConsentEvent>, res: Response) => {
        const { userId, consentType, status, timestamp } = req.body;

        if (!userId || !consentType || !status || !timestamp) {
            return res.status(400).json({ error: 'Missing required fields: userId, consentType, status, timestamp.' });
        }
        if (!['granted', 'revoked'].includes(status)) {
            return res.status(400).json({ error: 'Status must be "granted" or "revoked".' });
        }
        if (isNaN(Date.parse(timestamp))) {
            return res.status(400).json({ error: 'Timestamp must be a valid ISO 8601 string.' });
        }

        const newConsentEvent: ConsentEvent = {
            userId,
            consentType,
            status,
            timestamp,
        };

        if (!userConsentStore[userId]) {
            userConsentStore[userId] = [];
        }
        userConsentStore[userId].push(newConsentEvent);

        console.log(`[VERIFIABLE LOG]: Consent event recorded for user ${userId}:`, newConsentEvent);

        res.status(201).json({
            message: 'Consent event recorded successfully.',
            consentEvent: newConsentEvent,
        });
    });

    app.get('/consent/:userId', (req: Request<{ userId: string }>, res: Response) => {
        const { userId } = req.params;
        const userEvents = userConsentStore[userId];

        if (!userEvents || userEvents.length === 0) {
            return res.status(404).json({ error: `No consent events found for user: ${userId}` });
        }

        res.status(200).json({
            message: `Consent events for user ${userId}.`,
            consentEvents: userEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        });
    });


    // --- Swagger/OpenAPI Setup (Task 1.6) ---
    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'ZynConsent API - MVP',
                version: '1.0.0',
                description: 'API for managing user consent in the Minkalla ZynConsent module (MVP).',
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                    description: 'Local Development Server',
                },
            ],
            components: {
                schemas: {
                    ConsentEvent: {
                        type: 'object',
                        required: ['userId', 'consentType', 'status', 'timestamp'],
                        properties: {
                            userId: {
                                type: 'string',
                                description: 'Unique identifier for the user.',
                                example: 'user-abc-123',
                            },
                            consentType: {
                                type: 'string',
                                description: 'Type of consent (e.g., marketing, analytics, data_sharing).',
                                example: 'marketing_emails',
                            },
                            status: {
                                type: 'string',
                                enum: ['granted', 'revoked'],
                                description: 'Status of the consent: "granted" or "revoked".',
                                example: 'granted',
                            },
                            timestamp: {
                                type: 'string',
                                format: 'date-time',
                                description: 'ISO 8601 formatted timestamp of the consent event.',
                                example: '2023-10-27T10:00:00Z',
                            },
                        },
                        example: {
                            userId: 'user-abc-123',
                            consentType: 'marketing_emails',
                            status: 'granted',
                            timestamp: '2023-10-27T10:00:00Z',
                        },
                    },
                },
            },
            tags: [
                {
                    name: 'Consent',
                    description: 'Consent Management Endpoints',
                },
                {
                    name: 'Health',
                    description: 'Application Health Check',
                },
            ],
            paths: {
                '/consent': {
                    post: {
                        tags: ['Consent'],
                        summary: 'Records a new consent event for a user.',
                        description: 'This endpoint allows recording a user\'s consent status for a specific type. For MVP, consent data is stored in-memory.',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ConsentEvent',
                                    },
                                },
                            },
                        },
                        responses: {
                            '201': {
                                description: 'Consent event recorded successfully.',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string', example: 'Consent event recorded successfully.' },
                                                consentEvent: { $ref: '#/components/schemas/ConsentEvent' },
                                            },
                                        },
                                    },
                                },
                            },
                            '400': {
                                description: 'Invalid request payload.',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'Invalid consent event data.' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/consent/{userId}': {
                    get: {
                        tags: ['Consent'],
                        summary: 'Retrieves all consent events for a specific user.',
                        description: 'This endpoint returns a chronological list of all consent events recorded for a given user ID. For MVP, data is retrieved from in-memory storage. This endpoint helps with GDPR\'s "right to access" principle.',
                        parameters: [
                            {
                                in: 'path',
                                name: 'userId',
                                required: true,
                                schema: {
                                    type: 'string',
                                },
                                description: 'Unique identifier of the user.',
                            },
                        ],
                        responses: {
                            '200': {
                                description: 'Successfully retrieved consent events.',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: { type: 'string', example: 'Consent events for user user-abc-123.' },
                                                consentEvents: {
                                                    type: 'array',
                                                    items: {
                                                        $ref: '#/components/schemas/ConsentEvent',
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            '404': {
                                description: 'No consent events found for the specified user.',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                error: { type: 'string', example: 'No consent events found for user: non-existent-user.' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '/health': {
                    get: {
                        tags: ['Health'],
                        summary: 'Health check endpoint',
                        description: 'Returns the status of the ZynConsent service.',
                        responses: {
                            '200': {
                                description: 'Service is healthy.',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                status: { type: 'string', example: 'ok' },
                                                service: { type: 'string', example: 'ZynConsent MVP' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        apis: [],
    };

    const swaggerDocs = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({ status: 'ok', service: 'ZynConsent MVP' });
    });

    app.listen(port, () => {
        console.log(`ZynConsent MVP API running on http://localhost:${port}`);
        console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
    });

    export default app;
    