import * as React from 'react';
import type {SVGProps} from 'react';
const SvgDelete = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 1024 1024"
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M912 259.5v80h-48V866c0 39.765-32.235 72-72 72H232c-39.765 0-72-32.235-72-72V339.5h-48v-80h800Zm-128 80H240V830c0 15.31 12.287 27.749 27.537 28H756c15.31 0 27.749-12.287 28-27.537V339.5Zm-147 129v240h-80v-240h80Zm-170 0v240h-80v-240h80Zm215-379v80H342v-80h340Z"
        />
    </svg>
);
export default SvgDelete;
