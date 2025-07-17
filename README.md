## Project Store - Full-Stack E-Commerce Platform

Project Store is a complete, full-stack e-commerce web application designed, built, and deployed from the ground up. It showcases a comprehensive understanding of modern software engineering principles, from frontend UI/UX development to backend API design, secure authentication, and automated, cloud-native deployment on Kubernetes. It is a containerized, multi-component application deployed to a bare-metal Kubernetes cluster, managed by a fully automated GitOps CI/CD pipeline.

#### Workflow
1. A developer pushes code to a GitHub repository.
2. A Jenkins pipeline automatically triggers, building and testing the application, and then publishing versioned Docker images to Google Artifact Registry.
3. Flux CD, running in the Kubernetes cluster, detects the new image tag in the Git repository.
4. Flux CD automatically pulls the new image and orchestrates a rolling deployment of the application, ensuring a seamless, zero-downtime update.

#### Key Features
- Modern Frontend: A fully responsive and interactive user interface built with Next.js, TypeScript, and TailwindCSS. Features real-time state management for the shopping cart and user sessions using Redux Toolkit.
- Secure RESTful API: A backend API built with Node.js and Express.js, providing a complete set of CRUD endpoints for managing users, products, and orders.
- Robust Authentication: A secure, token-based authentication system using JSON Web Tokens (JWTs) stored in HTTP-only cookies, with bcrypt-hashed passwords and custom middleware for protected routes and session management.
- Scalable Data Layer: A resilient and performant data architecture featuring PostgreSQL (managed by the CloudNativePG operator) for primary transactional data and Redis (managed by the Dragonfly operator) for high-speed caching of frequently accessed items and user carts.
- Cloud Storage Integration: Seamless integration with AWS S3 for scalable, cloud-based storage, retrieval, and lifecycle management of all product images.
- Automated GitOps CI/CD: An end-to-end CI/CD pipeline using Jenkins for automated builds and Google Artifact Registry for image storage. GitOps-driven deployments are managed by Flux CD, which continuously monitors the Git repository and Helm charts for changes.
- Cloud-Native Operations: Production-grade administration of stateful workloads on Kubernetes. Security is enforced with Cilium L3/L4 network policies and pod security standards, while performance and resilience are managed with Horizontal Pod Autoscaling and resource quotas.

Tech Stack
- Frontend: Next.js, React, TypeScript, Redux Toolkit, TailwindCSS
- Backend: Node.js, Express.js
- Databases: PostgreSQL, Redis, Dragonfly
- Authentication: JWT, bcrypt
- Cloud & DevOps: AWS S3, Docker, Kubernetes, Jenkins, Flux CD, Helm, Cilium, Google Cloud Platform (GCP) Artifact Registry