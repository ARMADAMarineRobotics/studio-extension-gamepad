import { ExtensionContext } from "@foxglove/studio";
import { initGamepadPanel } from "./GamepadPanel";

export function activate(extensionContext: ExtensionContext): void {
    extensionContext.registerPanel({
        name: "Gamepad",
        initPanel: initGamepadPanel,
    });
}
