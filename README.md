# mindbox-test-task

### Contents

- [Description](#description)
- [Stack](#stack)
- [Install](#install)

---

## Description

Test task for the frontend position: [link](https://www.notion.so/Frontend-Next-2638faf77184803a8c1ccb30205d11e4).

[Deploy](https://itwebs-test-task-flame.vercel.app/)

## Stack

Stack:

- Next.js
- TypeScript
- SCSS
- React Hook Form
- Zod
- tRPC (websockets)
- DrizzleORM
- PostgreSQL
- docker
- Vercel Blob

---

## Install

<details>
  <summary>Limited (not recommended)</summary>

!NB: _chat is not supported_

To start the application, please make sure you have [Git](https://git-scm.com) and [Node.js](https://nodejs.org) installed on your machine. Then, follow these steps:

1. clone repository: `git clone https://github.com/GoodValts/itwebs-test-task.git`
1. navigate to the project directory: `cd itwebs-test-task`
1. install dependencies: `npm install`
1. rename `.env..env.example` to `.env`
1. start app: `npm run dev`
1. open the link or navigate to `http://localhost:3000/`

</details>

<details>
  <summary>Full</summary>

To start the application, please make sure you have [Git](https://git-scm.com) and [Node.js](https://nodejs.org) and [docker](https://www.docker.com/get-started/) installed on your machine.

Then, follow these steps:

1. clone repository: `git clone git@github.com:GoodValts/itwebs-test-task.git`
1. navigate to the project directory: `cd itwebs-test-task`
1. install dependencies: `pnpm install`
1. rename `.env.example` to `.env`
1. create a vercel blob storage, then paste token to `.env` (`BLOB_READ_WRITE_TOKEN`)
1. run docker containers `docker-compose up -d` (required linux, or macOS, or wsl)
1. generate migrations `pnpm run db:generate`
1. run migrations `pnpm run db:migrate`
1. start app: `pnpm run dev`
1. open link to deploy (http://localhost:3000)
1. enjoy of websockets on tRPC

</details>
