import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} className='bg-corporate-blue rounded-lg p-1' viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <image href="/logo_white.png" width="100%" height="100%" />
        </svg>
    );
}
