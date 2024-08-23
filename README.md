# Reward System

This project is a Reward System built using [Hono.js](https://hono.dev/) as the backend framework and [Next.js](https://nextjs.org/) as the frontend template.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)

## Features

- Reward management system
- User-friendly interface
- Backend API with Hono.js
- Frontend with Next.js

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Munezero2000/reward_sys_bn.git
   cd reward_sys_bn
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

### Environment Variables

Before running the project, you need to set up the environment variables.

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in the required values in the `.env` file. These will be used to configure the application's environment.

### Running the Project

Once the environment variables are set up, you can run the project locally:

```bash
npx drizzle-kit generate --name migraiton_name
npx drizzle-kit migrate
pnpm dev
```

This command will start both the Hono.js backend and the Next.js frontend, allowing you to access the application in your browser.
