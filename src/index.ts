import { ExtensionContext } from "@foxglove/studio";
import { initGamepadPanel } from "./GamepadPanel";

export function activate(extensionContext: ExtensionContext) {
    extensionContext.registerPanel({
        name: "Gamepad",
        initPanel: initGamepadPanel 
    });
}
