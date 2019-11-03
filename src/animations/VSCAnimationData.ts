import * as vscode from 'vscode';

export enum VSCAnimDataDebugStatus {
    NONE,
    ACTIVE,
    PAUSE
}

export interface VSCAnimationData {
    config: vscode.WorkspaceConfiguration;
    debugStatus: VSCAnimDataDebugStatus;
    diagnostics: vscode.Diagnostic[];
	tasks: readonly vscode.TaskExecution[];
    openedTerminals: number;
}
