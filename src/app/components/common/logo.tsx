'use client';

import Image from "next/image";
import Link from "next/link";

const Logo:React.FC = () => {
    return (
        <Link href="/">
            <div className="center gap-[0.5rem]">
                <Image src="/images/logo.png" alt="logo" width={32} height={32} />
                <p className="text-normal leading-[30px] font-semibold">PegoTrack</p>
            </div>
        </Link>
    );
}
 
export default Logo;