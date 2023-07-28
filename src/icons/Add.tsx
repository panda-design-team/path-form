import * as React from 'react';
import type {SVGProps} from 'react';
const SvgAdd = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 1024 1024"
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M556 96v374.5h372v88H556V928h-88V558.5H96v-88h372V96z"
        />
    </svg>
);
export default SvgAdd;
