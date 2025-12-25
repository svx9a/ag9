<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Enterprise AI Orchestration Platform

This project has been upgraded to a unified Enterprise AI platform featuring:

- **Unified Dashboard**: Single interface for Admins, Providers, Pilots, and Farmers (`/dashboard`).
- **Multi-Role Orchestration**: Dynamic tab switching based on user role and query parameters.
- **AI Cost Optimizer**: Real-time routing across Mistral, Gemini, and local models.
- **Fleet Telemetry**: Real-time drone tracking and agent pulse monitoring.

### Unified Dashboard Access

The new unified dashboard is accessible at `/dashboard`. You can switch between views using the top navigation tabs or by appending a `?tab=` query parameter:
- `?tab=overview`: General platform metrics
- `?tab=provider`: Drone service provider management
- `?tab=admin`: System-wide administration and fleet oversight
- `?tab=pilot`: Pilot mission control and status
- `?tab=farmer`: Farmer service requests and history

## Deployment

### Local Production (Docker Compose)

To test the production environment locally with PostgreSQL and MongoDB:
```bash
docker-compose up --build
```

### AWS ECS Deployment

The project includes a GitHub Actions workflow for automated deployment to AWS ECS:
1. Configure your AWS credentials in GitHub Secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
2. Push to the `main` branch to trigger the `Deploy to Amazon ECS` workflow.
3. The workflow will build the Docker image, push it to ECR, and update the ECS service.

Deployment artifacts:
- `.github/workflows/aws-ecs.yml`: Deployment pipeline
- `.aws/task-definition.json`: ECS Task Definition
- `docker-compose.yml`: Local production orchestration
