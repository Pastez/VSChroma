import {IDeviceData} from "./Devices/Base";
import Effect from "./Effect";

export class DeviceRequestData implements IDeviceData {
    public activeEffect: Effect | undefined;
    public effectData: any;
    public device: string | undefined;
}
