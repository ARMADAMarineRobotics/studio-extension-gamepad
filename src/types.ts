import { Time } from "@foxglove/rostime";


// std_msgs/Header message definition
// https://docs.ros.org/en/api/std_msgs/html/msg/Header.html
type Header = {
    frame_id: string;
    stamp: Time;
    seq: number;
};


// sensor_msgs/Joy message definition
// http://docs.ros.org/en/api/sensor_msgs/html/msg/Joy.html
export type Joy = {
    header: Header;
    axes: number[];
    buttons: number[];
};


export type ButtonMapping = {
    name: string;
    index: number;
    showInEditor?: boolean;
};

export type DirectionalMapping = {
    x: number;  // x-axis index
    y: number;  // y-axis index
    deadzone: number;
    showInEditor?: boolean;
};

export type GamepadMapping = {
    buttons: ButtonMapping[];
    directionals: DirectionalMapping[];
};
