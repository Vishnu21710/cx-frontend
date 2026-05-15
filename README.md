# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Docker

Build the production image:

```bash
docker build --build-arg VITE_API_URL=https://your-api.example.com/api -t cx-frontend .
```

Run it locally:

```bash
docker run --rm -p 8080:80 cx-frontend
```

Or use Docker Compose:

```bash
VITE_API_URL=https://your-api.example.com/api docker compose up --build
```

The app is served by Nginx on port 80 inside the container. `VITE_API_URL` is a Vite build-time variable, so set it when building the image for AWS.
