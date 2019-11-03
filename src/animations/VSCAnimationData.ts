import * as vscode from 'vscode';

export enum VSCAnimDataDebugStatus {
    NONE,
    ACTIVE,
    PAUSE
}

export interface VSCAnimationData {
    config: vscode.WorkspaceConfiguration;
    debugStatus: VSCAnimDataDebugStatus;
    numOfProblems: number;
    openedTerminals: number;
}
