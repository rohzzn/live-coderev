import fetch from 'node-fetch';

const DEVREV_API_BASE = 'https://api.devrev.ai'; // Example base URL
const DEVREV_TOKEN = process.env.DEVREV_TOKEN || '';

// Create a DevRev Issue
export async function createDevRevIssue(title: string, description: string) {
  const response = await fetch(`${DEVREV_API_BASE}/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEVREV_TOKEN}`
    },
    body: JSON.stringify({ title, description })
  });
  if (!response.ok) {
    throw new Error(`Failed to create issue: ${response.statusText}`);
  }
  return response.json();
}

// Update DevRev Issue
export async function updateDevRevIssue(issueId: string, updates: { status?: string; description?: string }) {
  const response = await fetch(`${DEVREV_API_BASE}/issues/${issueId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEVREV_TOKEN}`
    },
    body: JSON.stringify(updates)
  });
  if (!response.ok) {
    throw new Error(`Failed to update issue: ${response.statusText}`);
  }
  return response.json();
}
