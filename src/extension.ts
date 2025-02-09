import * as vscode from 'vscode';
import { createDevRevIssue, updateDevRevIssue } from './devrevApi';
import { getAiSuggestions } from './aiAssistant';

export function activate(context: vscode.ExtensionContext) {
  // 1. Command: Create DevRev Issue
  const createIssueCommand = vscode.commands.registerCommand('live-coderev.createIssue', async () => {
    const title = await vscode.window.showInputBox({ prompt: 'Enter DevRev Issue Title' });
    const description = await vscode.window.showInputBox({ prompt: 'Enter Issue Description' });

    if (!title || !description) {
      vscode.window.showErrorMessage('Title and description are required.');
      return;
    }
    try {
      const newIssue = await createDevRevIssue(title, description);
      vscode.window.showInformationMessage(`Created DevRev Issue: ${newIssue.id}`);
    } catch (err: any) {
      vscode.window.showErrorMessage(`Error creating issue: ${err.message}`);
    }
  });

  // 2. Command: Update DevRev Issue
  const updateIssueCommand = vscode.commands.registerCommand('live-coderev.updateIssue', async () => {
    const issueId = await vscode.window.showInputBox({ prompt: 'Enter the DevRev Issue ID' });
    if (!issueId) {
      vscode.window.showErrorMessage('Issue ID is required.');
      return;
    }

    const newStatus = await vscode.window.showInputBox({ prompt: 'Enter new status (optional)' });
    const newDescription = await vscode.window.showInputBox({ prompt: 'Enter new description (optional)' });

    try {
      const updatedIssue = await updateDevRevIssue(issueId, { status: newStatus, description: newDescription });
      vscode.window.showInformationMessage(`Updated Issue ${issueId}. New status: ${updatedIssue.status}`);
    } catch (err: any) {
      vscode.window.showErrorMessage(`Error updating issue: ${err.message}`);
    }
  });

  // 3. Command: Get AI Suggestions
  const aiSuggestCommand = vscode.commands.registerCommand('live-coderev.aiSuggestions', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor!');
      return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
      vscode.window.showErrorMessage('Select some code to get suggestions.');
      return;
    }

    const codeSnippet = editor.document.getText(selection);
    try {
      const suggestions = await getAiSuggestions(codeSnippet);
      vscode.window.showInformationMessage(`AI Suggestions:\n${suggestions}`);
    } catch (err: any) {
      vscode.window.showErrorMessage(`AI suggestion error: ${err.message}`);
    }
  });

  // Register the commands
  context.subscriptions.push(createIssueCommand, updateIssueCommand, aiSuggestCommand);
}

export function deactivate() {
  // cleanup if needed
}
