![micro drawio](https://github.com/ngocphucnguyen256/nodejs-microservices-admin-panel/assets/69982260/2ad3ab84-3fbe-46e6-9c32-c19c143a83de)

This project implements a microservices architecture on the backend, enhancing backend functionalities through a suite of services.</br>
Each service is designed to handle specific operations and communicate via RabbitMQ message queue to ensure seamless inter-service communication.</br>
The architecture is designed to ensure that each service operates independently with its own decoupled database, enhancing both security and performance.

Backend Services:

API Gateway: Acts as a proxy for routing requests to the appropriate services.</br>
User Service: Manages user authentication and user-related functionalities, Google account login. </br>
Chat Service: Facilitates real-time chat functions using WebSockets.</br>
Notification Service: Responsible for sending notifications throughout the application, supporting real-time push notifications via WebSockets.

Key Features:

Swagger: Utilized for API documentation, making the APIs more accessible and understandable.</br>
Logging: Systematic logging to files for effective monitoring and debugging.</br>

Backend Technology Stack:

Node.js and Express: For building fast and scalable server-side applications.</br>
TypeScript: Adds static types to JavaScript for safer coding and maintenance.</br>
TypeORM: ORM tool for interacting with the MySQL database using object-oriented principles.</br>
MySQL: The database choice for storing service data securely and efficiently.</br>
WebSocket: Enables real-time, bidirectional communication between web clients and servers.</br>
RabbitMQ: Handles asynchronous message queuing between services.

REALTIME CHAT - done
UPLOADS - done
GOOGLE LOGIN - done
MESSAGE QUEUE - done
NOTIFICATION - done
