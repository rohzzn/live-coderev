# Live CodeRev
A VS Code extension and DevRev snap-in for seamless coding, issue tracking, and AI code suggestions.

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Architecture](#architecture)  
4. [Tech Stack](#tech-stack)  
5. [Setup and Installation](#setup-and-installation)  
6. [Usage Guide](#usage-guide)  
7. [Configuration](#configuration)  
8. [Limitations](#limitations)  
9. [Next Steps](#next-steps)  
10. [License](#license)

---

## 1. Overview

**Live CodeRev** is a lightweight yet powerful developer tool that tightly integrates [DevRev](https://devrev.ai) with [Visual Studio Code](https://code.visualstudio.com/). By installing this extension in VS Code, developers can:

- Create and update DevRev Issues without leaving the editor.
- Automatically link commits to DevRev Issues for seamless collaboration.
- Leverage an AI assistant to generate code insights, provide bug fixes, or suggest optimizations _in real time_.

This project is part of the **DevRev Snap-a-thon**, aiming to demonstrate how to unify developer workflows, reduce context switching, and harness AI to accelerate software development.

---

## 2. Features

1. **In-Editor Issue Management**  
   - Create new DevRev Issues directly from VS Code.  
   - Update issue statuses (“In Progress,” “Done,” etc.) and add descriptions or comments.

2. **AI Code Suggestions**  
   - Select code in your editor to receive AI-powered refactoring tips, bug detection suggestions, and best practice advice.  
   - Uses either a free AI model (e.g., Fireworks.ai) or a locally hosted LLM for zero-cost usage.

3. **Commit & Issue Linking** (Optional)  
   - Automatically detect DevRev Issue IDs in commit messages and link them to relevant Issues.  
   - Provides quick references within the DevRev dashboard, so teams know which commits resolve which Issues.

4. **No-Cost Setup**  
   - All components can run on free tiers: DevRev’s developer environment, VS Code, open-source LLMs or free-tier AI services.

---

## 3. Architecture

Here is a high-level look at the system:

```
                   ┌─────────────────────────────────┐
                   │      VS Code (Editor)          │
                   │  "Live CodeRev" Extension      │
                   └───────────────┬─────────────────┘
                                   │
                       DevRev APIs │ RESTful requests (Create/Update Issue)
                                   │
          ┌────────────────────────▼─────────────────────────┐
          │                  DevRev Platform                 │
          │  (Snap-in config, issue tracking, etc.)         │
          └────────────────────────▲─────────────────────────┘
                                   │
                      AI Analysis  │ (Optional calls for code suggestions)
                                   │
       ┌───────────────────────────▼───────────────────────────┐
       │      Free-tier/Open-source AI (OpenAI/Fireworks.ai)   │
       │          or locally hosted LLM for suggestions        │
       └────────────────────────────────────────────────────────┘
```

1. **VS Code Extension**:  
   - Exposes commands (e.g., “Create DevRev Issue,” “AI Suggestions”).  
   - Sends requests to DevRev’s APIs and receives JSON responses.

2. **DevRev**:  
   - Hosts a Snap-in for minimal configuration if needed (e.g., storing OAuth credentials, webhooks).  
   - Stores and manages Issues, statuses, and developer tasks.

3. **AI Service**:  
   - Provides code suggestions based on short text prompts (selected code snippets).  
   - Can be a free-tier online service or a local LLM server.

---

## 4. Tech Stack

- **Primary**  
  - [Visual Studio Code Extension API](https://code.visualstudio.com/api) (written in TypeScript)  
  - [DevRev REST API](https://devrev.ai/docs)  
- **AI Integration**  
  - [Fireworks.ai](https://www.fireworks.ai/) free-tier or local LLM (GPT4All, Llama-2-based, etc.)  
  - Alternatively, use an OpenAI trial if available (no mandatory cost).  
- **Languages/Frameworks**  
  - **TypeScript** for the extension  
  - **Node.js** for the local environment  
  - **Snap-in**: minimal or no custom code if the extension only calls DevRev’s APIs.  

---

## 5. Setup and Installation

### 5.1 Prerequisites

1. **DevRev Account**  
   - Sign up for a free [DevRev Developer account](https://devrev.ai/).  
   - Obtain a Personal Access Token (PAT) or OAuth client ID/secret from the DevRev console.  

2. **Node.js and npm**  
   - Recommended v16+ to ensure compatibility with modern libraries.

3. **VS Code**  
   - Latest stable version (free to download).

4. **(Optional) Local AI Model**  
   - If you want zero dependency on external services, install a local LLM like GPT4All. Alternatively, create a free account on Fireworks.ai for hosted AI.

### 5.2 Installation Steps

1. **Clone the Repo**
   ```bash
   git clone https://github.com/rohzzn/live-coderev.git
   cd live-coderev
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**  
   - Create a `.env` file in the project root:
     ```bash
     DEVREV_TOKEN=<YOUR_DEVREV_PERSONAL_ACCESS_TOKEN>
     AI_API_KEY=<YOUR_AI_SERVICE_KEY or leave blank>
     AI_API_ENDPOINT=<optional: URL to local AI server or fireworks.ai>
     ```
   - This ensures the extension can call DevRev and AI endpoints securely.

4. **Launch the Extension**  
   - Open the project folder in VS Code.  
   - Press `F5` to start an “Extension Development Host” window with “Live CodeRev” loaded.

5. **(Optional) Snap-in Installation in DevRev**  
   - Go to your DevRev environment → Snap-ins → Install your package (if you published it).  
   - For basic usage, you only need a valid PAT to interact with DevRev.

---

## 6. Usage Guide

1. **Open the Command Palette**  
   - In VS Code, press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac).

2. **Create an Issue**  
   - Type `DevRev: Create Issue` and press Enter.  
   - Enter a title, then a description.  
   - The extension calls DevRev, creates the Issue, and displays the resulting Issue ID.

3. **Update an Issue**  
   - Select `DevRev: Update Issue`.  
   - Enter the Issue ID and new status/description as prompted.  
   - Confirm the update. The extension sends a PATCH request to DevRev.

4. **AI Suggestions**  
   - Highlight a block of code in your active editor.  
   - Select `DevRev: AI Suggestions` from the command palette.  
   - The extension sends the highlighted snippet to the AI service, then displays suggestions or code improvements in a popup or an output panel.

5. **Linking Commits** (Optional)  
   - Include the DevRev Issue ID in your commit message, e.g., `git commit -m "Fix memory leak #ISSUE-1234"`.  
   - If you set up a commit hook or the extension’s auto-detect feature, it will update the DevRev Issue with a note referencing that commit.

---

## 7. Configuration

1. **Extension Settings**  
   - You can store tokens or keys in VS Code Settings or the `.env` file.
   - For security, consider using [VS Code Secret Storage](https://code.visualstudio.com/api/extension-guides/authentication) if you plan on distributing this widely.

2. **AI Model Options**  
   - **Local Model**: `AI_API_ENDPOINT=http://localhost:5000/api` (example).  
   - **Fireworks.ai**: `AI_API_ENDPOINT=https://api.fireworks.ai/v1/generate` with your `AI_API_KEY`.  
   - **OpenAI**: `AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions` with your `AI_API_KEY`.  

3. **DevRev**  
   - `DEVREV_TOKEN` must be valid. Obtain one from DevRev → Settings → Tokens.

---

## 8. Limitations

1. **AI Context Length**:  
   - Free or local models may have reduced context windows, limiting the code snippet size they can process.

2. **Local Hosting**:  
   - If using a local LLM, you must keep your local server running to receive suggestions.

3. **Commit Linking**:  
   - Automatic linking of commits requires either manual referencing or a local Git hook. This is not entirely “out of the box.”

4. **Feature Scope**:  
   - For hackathon demo, advanced features (like advanced analytics or real-time notifications from DevRev to VS Code) may be limited.

---

## 9. Next Steps

1. **Enhanced Two-Way Sync**  
   - Implement a webhook so that changes in DevRev Issues instantly reflect in VS Code notifications.

2. **Deeper AI Integration**  
   - Expand the AI prompt to support code generation, unit testing suggestions, or automated docstrings.

3. **Team Collaboration**  
   - Add multi-user workflows so each team member’s DevRev changes show up in shared code spaces (e.g., via Live Share).

4. **Publish the Extension**  
   - Officially distribute on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/) for easier adoption.

---

## 10. License

_Include your preferred open-source license here (e.g., MIT, Apache 2.0, etc.)._

```
MIT License

Copyright (c) 2025 ...

Permission is hereby granted, free of charge...
```

---

### Thank You!

Thank you for checking out **Live CodeRev**. We hope this integration streamlines your development flow by merging issue management and AI-based code improvement into your everyday coding environment—_without any extra cost_. Feel free to open issues or submit pull requests to further enhance this project!