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
