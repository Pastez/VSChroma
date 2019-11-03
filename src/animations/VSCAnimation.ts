import { Animation, Color, Key, AnimationFrame } from '@pastez/chromajs';
import Keyboard from '@pastez/chromajs/dist/Devices/Keyboard';
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

            frame.Keyboard.setAll(new Color(this._data.config.defaultColor));
            switch (this._data.debugStatus) {
                case VSCAnimDataDebugStatus.ACTIVE:
                    frame.Keyboard.setRow(0, new Color(0, 0, 0));
                    frame.Keyboard.setPosition(0, Math.floor((Keyboard.Columns - 1) * Math.sin(prc * Math.PI)), new Color(64, 0, 0));
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
            this._data.diagnostics.forEach((v, i) => {
                if (i <= 10) {
                    frame.Keyboard.setPosition(1, i + 2, v.severity === DiagnosticSeverity.Error ? colorError : colorWarning);
                }
            });

            const colorTerminal = new Color(this._data.config.terminalColor);
            if (this._data.openedTerminals > 0) {
                frame.Keyboard.setKey(Key.OemTilde, colorTerminal);
            }

            this.Frames.push(frame);
        }
    }
}
