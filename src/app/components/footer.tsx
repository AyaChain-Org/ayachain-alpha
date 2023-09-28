'use client';

import React from "react";
import InvertedLogo from "./common/invertedLogo";
import Link from "next/link";

const Footer:React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-blue text-white center relative w-full min-h-[230px]">
            <div className="p-12 w-full h-full flex-col flex gap-20">
                <div className="start">
                    <InvertedLogo />
                </div>
                <div className="flex md:flex-row flex-col gap-10">
                    <div className="w-full">
                        <p>&copy; {currentYear} PegoTrack. All Rights Reserved.</p>
                    </div>
                    <div className="center w-full z-10">
                        <ul className="flex w-full flex-col md:flex-row gap-5 capitalize font-medium">
                            <li className="hover:scale-95 transition-all duration-300">
                                <Link href="#">Privacy Policy</Link>
                            </li>
                            <li className="hover:scale-95 transition-all duration-300">
                                <Link href="#">Term of Use</Link>
                            </li>
                            <li className="hover:scale-95 transition-all duration-300">
                                <Link href="#">Contact Us</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <img src="icons/Vector3.png" alt="vector" className="absolute right-0 top-0" />
        </div>
    );
}
 
export default Footer;

