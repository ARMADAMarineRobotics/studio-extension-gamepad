import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { GamepadMapping } from "./mapping";


import gamepadImage from "./open-joystick-display/themes/ojd-sony-playstation/images/analog-black.svg";

import "./open-joystick-display/themes/ojd-sony-playstation/theme-analog-black.css";


import themeHtml from "./open-joystick-display/themes/ojd-sony-playstation/theme-analog-black.html";

import themeInfo from "./open-joystick-display/themes/ojd-sony-playstation/theme.json";
const styleInfo = themeInfo.styles[0];


type OJDGamepadViewProps = {
    // TODO theme, style
    gamepad: Gamepad;
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

    // After the first render, find all of the 
    useEffect(() => {
        const circle = props.mapping.buttons.find((button) => (button.name === 'CIRCLE'));
        if (circle) {
            if (props.gamepad.buttons[circle.index]?.pressed) {
                viewRef.current?.querySelector(`*[ojd-button='CIRCLE']`)?.classList.add("active");
            } else {
                viewRef.current?.querySelector(`*[ojd-button='CIRCLE']`)?.classList.remove("active");
            }
        }
    }, [props.gamepad, props.mapping]);

    return (
        <>
            <div ref={viewRef} dangerouslySetInnerHTML={{ __html: container.innerHTML }} />
        </>
    );
}
