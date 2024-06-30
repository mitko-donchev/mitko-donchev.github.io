import * as React from "react";

function SvgComponent(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 96 78"
            width="56" 
            height="42"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path
                d="M30 69 H66 C75 69 81 63 81 55.5 C81 48 75 42 66 42 C64.5 42 63 42 61.5 42 C57 30 46.5 22.5 34.5 22.5 C24 22.5 15 31.5 15 42 C9 42 3 46.5 3 54 C3 61.5 9 69 18 69 H30"
                fill="#f2b300"
                stroke="#0b093b"
            />
        </svg>
    );
}

export default SvgComponent;
