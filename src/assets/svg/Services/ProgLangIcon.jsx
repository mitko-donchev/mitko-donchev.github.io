import * as React from "react";

function SvgComponent(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="42"
            height="42"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect
                x="2"
                y="2"
                width="60"
                height="60"
                rx="10"
                fill="#7620ff"
                stroke="#0b093b"
            />
            <path
                d="M20 20 L10 32 L20 44"
                stroke="#0b093b"
            />
            <path
                d="M44 20 L54 32 L44 44"
                stroke="#0b093b"
            />
            <path
                d="M34 12 L28 52"
                stroke="#0b093b"
            />
        </svg>
    );
}

export default SvgComponent;
