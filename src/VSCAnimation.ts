import { Animation, Color, Key, AnimationFrame } from '@pastez/chromajs';
import Keyboard from '@pastez/chromajs/dist/Devices/Keyboard';


export enum VSCAnimDataDebugStatus {
    NONE,
    ACTIVE,
    PAUSE
}

export interface VSCAnimationData {
    debugStatus: VSCAnimDataDebugStatus;
}

export class VSCAnimation extends Animation {

    readonly frameCnt = 30;

    constructor(private _data: VSCAnimationData) {
        super();
    }

    public async createFrames() {
        for (let f = 0; f < this.frameCnt; f++) {
            const frame = new AnimationFrame();
            const prc = f / this.frameCnt;

            frame.Keyboard.setAll(new Color(8, 8, 8));
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

            this.Frames.push(frame);
        }
    }
}
