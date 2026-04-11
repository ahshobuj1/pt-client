# Online Assessment Platform

[![Live Demo]](https://assesment-client-fawn.vercel.app) [![Video Walkthrough]](<Video Recording Link>)

*Please replace `<Live Demo Link>` and `<Video Recording Link>` with the actual URLs.*

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Setup Instructions](#setup-instructions)
- [Architecture & Professional Insights](#architecture--professional-insights)
  - [MCP Integration Strategy](#mcp-integration-strategy)
  - [AI Tools in Frontend Development](#ai-tools-in-frontend-development)
  - [Offline Mode & Fault Tolerance](#offline-mode--fault-tolerance)

---

## Project Overview

The **Online Assessment Platform** is an enterprise-grade digital evaluation ecosystem designed to streamline the exam creation and participation process. It connects Employers to Candidates securely. 

- **Employers** can seamlessly create dynamic, categorized assessments, tracking candidates through an interactive dashboard.
- **Candidates** experience a secure, streamlined testing environment fortified with strict behavioral integrity tracking (such as tab-switching detection and full-screen enforcement) to guarantee fair evaluations.

## Tech Stack

This platform leverages modern technologies designed for scale, performance, and outstanding developer experience.

### Frontend
- **Framework:** Next.js (App Router)
- **State Management:** Redux Toolkit & RTK Query
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Language:** TypeScript

### Backend
- **Framework:** NestJS
- **Database ORM:** Prisma (v7.4)
- **Database Engine:** PostgreSQL
- **Language:** TypeScript

---

## Setup Instructions

Follow these steps to set up the frontend environment locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository and navigate into the project catalog:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

*Note: Make sure your NestJS API server is running concurrently and that `src/redux/api/apiSlice.ts` correctly points to your backend base URL.*

---

## Architecture & Professional Insights

### MCP Integration Strategy

**Model Context Protocol (MCP)** standardizes how AI models access external data streams. Implementing MCP into this workflow can drastically improve development velocity:
- **Figma MCP Integration:** A direct pipeline from design to component generation. The MCP can pull precise design tokens, layouts, and CSS variables from a Figma board to effortlessly bootstrap accurate, pixel-perfect Shadcn/Tailwind UI components, limiting human error during design handoffs.
- **Chrome DevTools MCP Integration:** Useful during intense debugging sessions, particularly for tracking exam-engine behavioral loops. The AI can dynamically extract DOM tree logs, React component depths, and network waterfalls through the DevTools MCP, analyzing RTK Query hydration faults in real time and proposing immediate optimization strategies.

### AI Tools in Frontend Development

Utilizing AI ecosystems like **Cursor**, **GitHub Copilot**, and **Claude** acts as a catalyst for scalable frontend delivery:
- **Rapid Boilerplating:** AI quickly generates repetitive configurations like Redux Slices, standard form validation schemas (via Zod), and fully typed RTK Query endpoints.
- **UI/UX Polishing:** Tools like Claude excel iteratively refining Tailwind CSS configurations based on natural language constraints (e.g., "make this sidebar navigation distinctly stand out from the canvas layout").
- **Swift Refactoring:** AI immediately isolates type-mismatches and lifecycle hydration errors during complex React dependency cycles, turning hours of tedious code tracing into mere seconds of guided repair.

### Offline Mode & Fault Tolerance

To ensure a continuous evaluation process despite intermittent network instability during an exam, we utilize a robust offline synchronization pipeline:
1. **Service Workers:** A Service Worker intercepts network requests. If the internet connection drops, the application transitions into a graceful fallback state, preventing browser timeouts and catastrophic UI crashes.
2. **IndexedDB for Local Caching:** The exam clock and the candidate's active JSON payloads (current answers, tab-switch counts, metadata) are instantly written to the browser's IndexedDB upon every change.
3. **Optimistic Synchronization:** When the `.onLine` browser event fires indicating network restoration, the application automatically pulls the cached responses from IndexedDB and syncs them upstream to the NestJS backend via a background sync queue, resolving without the candidate losing a single keystroke.
