import * as React from "react";

function SvgComponent(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="63.336" height="43.336" viewBox="0 0 32.531 43.336" {...props}>
            <g data-name="Group 72">
                <rect
                    x="0.75"
                    y="0.75"
                    width="31.031"
                    height="41.836"
                    rx="3"
                    ry="3"
                    fill="#0b093b"
                />
                <rect
                    x="3.5"
                    y="3.5"
                    width="25.531"
                    height="36.336"
                    rx="3"
                    ry="3"
                    fill="#FFFF00"
                />
                <circle
                    cx="16.265"
                    cy="37"
                    r="1.5"
                    fill="#0b093b"
                />
            </g>
        </svg>
    );
}

export default SvgComponent;
