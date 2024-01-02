import React from 'react'

const Loader = () => {
    return (
        <div className='flex justify-center'>
            <svg
                width="120px"
                height="120px"
                viewBox="0 0 120 120"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
            >
                <g
                    fill="none"
                    fillRule="evenodd"
                    strokeWidth="5"
                    transform="translate(60 60)"
                >
                    <circle cx="0" cy="0" r="10" strokeOpacity="0.5">
                        <animate
                            attributeName="r"
                            begin="0s"
                            dur="1.8s"
                            values="10;40"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="strokeOpacity"
                            begin="0s"
                            dur="1.8s"
                            values="1;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="strokeWidth"
                            begin="0s"
                            dur="1.8s"
                            values="5;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="0" cy="0" r="40" strokeOpacity="0.3">
                        <animate
                            attributeName="r"
                            begin="0s"
                            dur="1.8s"
                            values="40;10"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="strokeOpacity"
                            begin="0s"
                            dur="1.8s"
                            values="0.3;1"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="strokeWidth"
                            begin="0s"
                            dur="1.8s"
                            values="0;5"
                            calcMode="linear"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>
            </svg>

        </div>


    )
}

export default Loader
