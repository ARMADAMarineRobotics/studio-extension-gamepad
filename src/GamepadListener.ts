import { useCallback, useEffect, useRef } from "react";


type GamepadListenerProps = Readonly<{
    onConnect: (gamepad: Gamepad) => void;
    onDisconnect: (gamepad: Gamepad) => void;
    onUpdate: (gamepad: Gamepad) => void;
}>;


export function GamepadListener(
    { onConnect, onDisconnect, onUpdate }: GamepadListenerProps
): null {
    // MDN says that valid request IDs are non-zero, so we use zero to indicate
    // that there is no pending animation request.
    const animationRequestId = useRef<number>(0);

    const onAnimationFrame = useCallback(() => {
        let gamepadCount = 0;

        for (const gamepad of navigator.getGamepads()) {
            if (gamepad === null) continue;
            onUpdate(gamepad);
            gamepadCount ++;
        }

        // Reschedule for the next animation frame if there are any gamepads
        animationRequestId.current = (gamepadCount === 0) ? 0 :
            window.requestAnimationFrame(onAnimationFrame);
    }, [onUpdate]);

    const didConnect = useCallback((event: GamepadEvent) => {
        onConnect(event.gamepad);

        // Schedule an animation frame if there is not already one pending
        if (animationRequestId.current === 0) {
            animationRequestId.current =
                window.requestAnimationFrame(onAnimationFrame);
        }
    }, [onConnect, onAnimationFrame]);

    const didDisconnect = useCallback((event: GamepadEvent) => {
        onDisconnect(event.gamepad);
    }, [onDisconnect]);

    // Register event listeners for gamepad connection and disconnection, and
    // unregister them when the component unmounts.
    useEffect(() => {
        window.addEventListener("gamepadconnected", didConnect);
        window.addEventListener("gamepaddisconnected", didDisconnect);
        return () => {
            window.removeEventListener("gamepadconnected", didConnect);
            window.removeEventListener("gamepaddisconnected", didDisconnect);
        };
    }, [didConnect, didDisconnect]);

    // Cancel any pending animation frames when the component unmounts
    useEffect(() => {
        return () => {
            if (animationRequestId.current !== 0) {
                window.cancelAnimationFrame(animationRequestId.current);
                animationRequestId.current = 0;
            }
        };
    }, []);

    return null;
}
