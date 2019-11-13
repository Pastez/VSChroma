import { Animation, Color, Key, AnimationFrame } from '@pastez/chromajs';
import { VSCAnimationData, VSCAnimDataDebugStatus } from './VSCAnimationData';
import { DiagnosticSeverity } from 'vscode';

export class VSCAnimation extends Animation {

    readonly frameCnt = 30;

    constructor(private _data: VSCAnimationData) {
        super();
    }

    public async createFrames() {
        for (let f = 0; f < this.frameCnt; f++) {
            const frame = new AnimationFrame();
            const prc = f / this.frameCnt;
            const prcEase = (Math.sin(prc * 2 * Math.PI) + 1) / 2;
            frame.Keyboard.setAll(new Color(this._data.config.defaultColor));
            switch (this._data.debugStatus) {
                case VSCAnimDataDebugStatus.ACTIVE:
                    frame.Keyboard.setRow(0, Color.Black);
                    frame.Keyboard.setPosition(0, 2 + Math.round(12 * prcEase), new Color(64, 0, 0));
                    frame.Keyboard.setKey([Key.LeftShift, Key.RightShift, Key.F5], new Color(255, 0, 0));
                    break;
                case VSCAnimDataDebugStatus.PAUSE:
                    frame.Keyboard.setRow(0, new Color(255 * Math.sin(prc * Math.PI), 0, 0));
                    break;
                default:
                    break;
            }

            const colorWarning = new Color(this._data.config.warningColor);
            const colorError = new Color(this._data.config.errorColor);
            this._data.diagnostics.filter(d => d.severity <= DiagnosticSeverity.Warning).forEach((v, i) => {
                if (i <= 10) {
                    frame.Keyboard.setPosition(1, i + 2, v.severity === DiagnosticSeverity.Error ? colorError : colorWarning);
                }
            });

            if (this._data.tasks.length > 0) {
                const colorTask = new Color(this._data.config.taskColor);
                frame.Keyboard.setKey(Key.Escape, colorTask);
            }

            const colorTerminal = new Color(this._data.config.terminalColor);
            if (this._data.openedTerminals > 0) {
                frame.Keyboard.setKey(Key.OemTilde, colorTerminal);
            }

            this.Frames.push(frame);
        }
    }
}
