import { useEffect, useRef } from "react";


type GamepadListenerProps = Readonly<{
    onConnect: (gamepad: Gamepad) => void;
    onDisconnect: (gamepad: Gamepad) => void;
    onUpdate: (gamepad: Gamepad) => void;
}>;


export function GamepadListener(props: GamepadListenerProps): null {
    // MDN says that valid request IDs are non-zero, so we use zero to indicate
    // that there is no pending animation request.
    const animationRequestId = useRef<number>(0);

    const onAnimationFrame = () => {
        let gamepadCount = 0;

        for (const gamepad of navigator.getGamepads()) {
            if (gamepad === null) continue;
            props.onUpdate(gamepad);
            gamepadCount ++;
        }

        // Reschedule for the next animation frame if there are any gamepads
        animationRequestId.current = (gamepadCount === 0) ? 0 :
            window.requestAnimationFrame(onAnimationFrame);
    };

    const onConnect = (event: GamepadEvent) => {
        props.onConnect(event.gamepad);

        // Schedule an animation frame if there is not already one pending
        if (animationRequestId.current === 0) {
            animationRequestId.current =
                window.requestAnimationFrame(onAnimationFrame);
        }
    };

    const onDisconnect = (event: GamepadEvent) => {
        props.onDisconnect(event.gamepad);
    }

    // Register event listeners for gamepad connection and disconnection, and
    // unregister them when the component unmounts.
    useEffect(() => {
        window.addEventListener("gamepadconnected", onConnect);
        window.addEventListener("gamepaddisconnected", onDisconnect);
        return () => {
            window.removeEventListener("gamepadconnected", onConnect);
            window.removeEventListener("gamepaddisconnected", onDisconnect);
        };
    }, []);

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
