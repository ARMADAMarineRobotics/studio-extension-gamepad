import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { GamepadMapping, Joy } from "../types";


import gamepadImage from "../open-joystick-display/themes/ojd-sony-playstation/images/analog-black.svg";

import "../open-joystick-display/themes/ojd-sony-playstation/theme-analog-black.css";


import themeHtml from "../open-joystick-display/themes/ojd-sony-playstation/theme-analog-black.html";

import themeInfo from "../open-joystick-display/themes/ojd-sony-playstation/theme.json";
const styleInfo = themeInfo.styles[0];


type OJDGamepadViewProps = {
    // TODO theme, style
    gamepad: Joy;
    mapping: GamepadMapping;
};


// Behavior is based on Open Joystick Display's ThemeController
export function OJDGamepadView(props: OJDGamepadViewProps): JSX.Element {
    const viewRef = useRef<HTMLDivElement>(null);

    const container = document.createElement("div");
    container.innerHTML = themeHtml;

    // Insert SVGs in elements with the ojd-svg attribute
    container.querySelectorAll("*[ojd-svg]").forEach((el) => {
        const svgPath = container.getAttribute("ojd-svg");
        el.innerHTML = gamepadImage;
        // const svg = document.createElement("img");
        // svg.setAttribute("src", gamepadImage);
        // el.appendChild(svg);
    });

    // Update the view to reflect the current state of the gamepad
    useEffect(() => {
        props.mapping.buttons.forEach((button) => {
            viewRef.current
                ?.querySelectorAll(`*[ojd-button='${button.name}']`)
                .forEach((element) => {
                    const pressed = (
                        (props.gamepad.buttons[button.index] ?? 0) > 0
                    );
                    element.classList.toggle("active", pressed);
                });
        });

        props.mapping.directionals.forEach((directional, i) => {
            let x = props.gamepad.axes[directional.x];
            let y = props.gamepad.axes[directional.y];
            if (!x || !y)
                return;

            // Act as though inactive within the deadzone
            const active = (Math.sqrt(x*x + y*y) >= directional.deadzone);
            if (!active) {
                x = y = 0;
            }

            viewRef.current?.querySelectorAll(`*[ojd-directional='${i}']`)
                .forEach((e) => {
                    const element = (e as HTMLElement | SVGElement);
                    element.classList.toggle("active", active);
                    element.style.top = `${(y!+1.0)*50}%`;
                    element.style.left = `${(x!+1.0)*50}%`;
                });
        });
    }, [props.gamepad, props.mapping]);

    return (
        <>
            <div ref={viewRef} dangerouslySetInnerHTML={{ __html: container.innerHTML }} />
        </>
    );
}
