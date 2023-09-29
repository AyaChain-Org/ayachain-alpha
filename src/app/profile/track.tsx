/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import CustomButton from '../components/common/button';
import { IProductHistory, useProductContext } from '../context/productContext';
import { IProductInfo } from '../context/productContext';


const Track: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [trackedProducts, setTrackedProducts] = useState<IProductInfo[]>([]);
    const [productHistory, setProductHistory] = useState<IProductHistory[]>([]);
    const [productDetails, setProductDetails] = useState(false)
    const { address } = useAccount()
    const { data } = useBalance({
        address: address,
    })

    const { products, getProductHistory } = useProductContext();

    const handleTrack = async () => {
        // Check if inputValue matches any product's intermediary or receiver wallet address
        const matchingProduct = products.find(
            (product) =>
                product.id == Number(inputValue)
        );

        if (matchingProduct) {
            setTrackedProducts([matchingProduct]);
            setProductHistory(await getProductHistory(Number(inputValue)));
        }

        setProductDetails(false)

    };

    const handleProductDetails = () => {
        setProductDetails(!productDetails);
    }

    return (
        <div className='flex flex-col gap-16 p-8'>
            <div className='pb-10'>
                {address ? (
                    <div className='flex flex-col w-full'>
                        <div>
                            <h1 className='font-bold text-md'>
                                Track Products
                            </h1>
                            <p className='text-sm'>
                                Get to know the realtime status of your product
                            </p>
                        </div>
                        <div className='h-[160px] gap-2 mt-20 border rounded-[12px] border-[#0000001A] bg-white p-6 flex flex-col'>
                            <p className="font-semibold">
                                Enter a Product ID
                            </p>
                            <div className="bg-[#F8F9FB] w-full between p-3 rounded-[18px]">
                                <div className="flex gap-4 w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M2.66699 12.9998C2.12033 12.9998 1.66699 12.5465 1.66699 11.9998V8.6665C1.66699 4.81317 4.81366 1.6665 8.66699 1.6665H12.0003C12.547 1.6665 13.0003 2.11984 13.0003 2.6665C13.0003 3.21317 12.547 3.6665 12.0003 3.6665H8.66699C5.90699 3.6665 3.66699 5.9065 3.66699 8.6665V11.9998C3.66699 12.5465 3.21366 12.9998 2.66699 12.9998Z" fill="#B3B0B0"/>
                                    <path d="M29.3333 12.9998C28.7867 12.9998 28.3333 12.5465 28.3333 11.9998V8.6665C28.3333 5.9065 26.0933 3.6665 23.3333 3.6665H20C19.4533 3.6665 19 3.21317 19 2.6665C19 2.11984 19.4533 1.6665 20 1.6665H23.3333C27.1867 1.6665 30.3333 4.81317 30.3333 8.6665V11.9998C30.3333 12.5465 29.88 12.9998 29.3333 12.9998Z" fill="#B3B0B0"/>
                                    <path d="M23.333 30.3335H21.333C20.7863 30.3335 20.333 29.8802 20.333 29.3335C20.333 28.7868 20.7863 28.3335 21.333 28.3335H23.333C26.093 28.3335 28.333 26.0935 28.333 23.3335V21.3335C28.333 20.7868 28.7863 20.3335 29.333 20.3335C29.8797 20.3335 30.333 20.7868 30.333 21.3335V23.3335C30.333 27.1868 27.1863 30.3335 23.333 30.3335Z" fill="#B3B0B0"/>
                                    <path d="M12.0003 30.3333H8.66699C4.81366 30.3333 1.66699 27.1867 1.66699 23.3333V20C1.66699 19.4533 2.12033 19 2.66699 19C3.21366 19 3.66699 19.4533 3.66699 20V23.3333C3.66699 26.0933 5.90699 28.3333 8.66699 28.3333H12.0003C12.547 28.3333 13.0003 28.7867 13.0003 29.3333C13.0003 29.88 12.547 30.3333 12.0003 30.3333Z" fill="#B3B0B0"/>
                                    </svg>
                                    <input 
                                        type="text"
                                        className="outline-none bg-[#F8F9FB] w-full" placeholder='Enter your Product ID '
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}/>
                                </div>
                                <div>
                                    <CustomButton onClick={handleTrack} background='#2F7AEA' textColor='#fff' borderRadius='16px' padding="10px 30px">Track</CustomButton>
                                </div>
                            </div>
                        </div>
                        <div className='relative'>
                            {trackedProducts && trackedProducts.length > 0 && (
                                <div className="flex gap-3 flex-wrap-reverse mt-10">
                                    {trackedProducts.map((product: IProductInfo, index: any) => (
                                        <div key={index} className='bg-white rounded-[16px] border border-[#0000001A] flex-col flex w-[340px] p-4 text-[16px] gap-2'>
                                            {product.productImage && (
                                                <img 
                                                src={URL.createObjectURL(new File([product.productImage], 'product.png', { type: 'image/png' }))}
                                                alt="image" className='w-full h-[250px] rounded-[12px] bg-cover object-cover' />
                                            )}
                                            <p className='font-semibold my-2'>{product.businessName}</p>
                                            <div className='between text-[14px]'>
                                                <p className=''>Product ID:</p>
                                                <p className="font-semibold">{String(product.id).padStart(10, "0")}</p>
                                            </div>
                                            <div className='between text-[14px]'>
                                                <p className='text-[14px] break-all'>Receiver&rsquo;s Address:</p>
                                                <a href={`https://scan.pego.network/address/${product.receiversAddress}`} target='_blank'>
                                                    <span className='font-semibold text-blue'>{product.receiversAddress.slice(0, 6)}..</span>
                                                </a>
                                            </div>
                                            <div className='between text-[14px]'>
                                                <p>Receiver&rsquo;s Location:</p>
                                                <p className='font-semibold'>{product.receiversLocation}</p>
                                            </div>
                                            <div className='between text-[14px]'>
                                                <p>Status</p>
                                                <p className='font-semibold'>{product.status}</p>
                                            </div>
                                            <div className='pt-3 border-t border-[#8B8D8F] mt-3'>
                                                <CustomButton onClick={handleProductDetails} background='#2F7AEA' textColor='#fff' borderRadius='16px'>
                                                    See Product History
                                                </CustomButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {productDetails && trackedProducts.length > 0 && (
                                <div className="absolute w-full h-full top-0 my-10 bg-white border border-[#0000001A] mb-20 rounded-[12px] center">
                                    {trackedProducts.map((product: IProductInfo, index: any) => (
                                        <div key={index} className='w-full h-full flex justify-between p-4'>
                                            <div className='w-[40%] flex-col flex text-[16px] gap-2'>
                                                {product.productImage && (
                                                    <img 
                                                        src={URL.createObjectURL(new File([product.productImage], 'product.png', { type: 'image/png' }))}
                                                        alt="image" className='w-[100px] h-[100px] rounded-[12px] bg-cover object-cover' />
                                                )}
                                                <p className='font-semibold my-2'>{product.businessName}</p>
                                                <div className='between text-[14px]'>
                                                    <p className=''>Product ID:</p>
                                                    <p className="font-semibold">{String(product.id).padStart(10, "0")}</p>
                                                </div>
                                                <div className='between text-[14px]'>
                                                    <p className='text-[14px] break-all'>Receiver&rsquo;s Address:</p>
                                                    <a href={`https://scan.pego.network/address/${product.receiversAddress}`} target='_blank'>
                                                        <span className='font-semibold text-blue'>{product.receiversAddress.slice(0, 6)}..</span>
                                                    </a>
                                                </div>
                                                <div className='between text-[14px]'>
                                                    <p>Receiver&rsquo;s Location:</p>
                                                    <p className='font-semibold'>{product.receiversLocation}</p>
                                                </div>
                                                <div className='between text-[14px]'>
                                                    <p>Status</p>
                                                    <p className='font-semibold'>{product.status}</p>
                                                </div>
                                            </div>
                                            <div className='w-[40%] bg-lightGray borde-[#0000001A] rounded-[12px] flex flex-col p-2'>
                                                <h3 className='font-bold mb-6 mt-3 ml-3 text-[20px]'>Your Product History</h3>
                                                {productHistory[0] &&
                                                    <div className='between w-full gap-3 mb-3' key={index}>
                                                        <img src="/svgs/tick.svg" alt="tick" />
                                                        <div className="rounded-[6px] p-2 border border-[#0000001A] w-full flex-col flex">
                                                            <div className='text-[18px] font-semibold flex justify-between'>
                                                                    <p>
                                                                        Created
                                                                    </p>
                                                                    <p className='text-[14px]'>
                                                                        {productHistory[0].time}
                                                                    </p>
                                                                </div>
                                                                <div className='text-[12px] flex justify-between'>
                                                                    <p>
                                                                    {productHistory[0].location}
                                                                    </p>
                                                                    <p>
                                                                        condition: {productHistory[0].condition.condition}
                                                                    </p>
                                                                </div>
                                                        </div>
                                                    </div>
                                                }
                                                {productHistory[1] &&
                                                    <div className='between w-full gap-3 mb-3' key={index}>
                                                        <img src="/svgs/tick.svg" alt="tick" />
                                                        <div className="rounded-[6px] p-2 border border-[#0000001A] w-full flex-col flex">
                                                            <div className='text-[18px] font-semibold flex justify-between'>
                                                                    <p>
                                                                        Shipped
                                                                    </p>
                                                                    <p className='text-[14px]'>
                                                                        {productHistory[1].time}
                                                                    </p>
                                                                </div>
                                                                <div className='text-[12px] flex justify-between'>
                                                                    <p>
                                                                    {productHistory[1].location}
                                                                    </p>
                                                                    <p>
                                                                        condition: {productHistory[1].condition.condition}
                                                                    </p>
                                                                </div>
                                                        </div>
                                                    </div>
                                                }
                                                {productHistory.slice(2).map((_product, index) => {
                                                    return (
                                                        <div className='between w-full gap-3 mb-3' key={index}>
                                                            <img src="/svgs/tick.svg" alt="tick" />
                                                            <div className="rounded-[6px] p-2 border border-[#0000001A] w-full flex-col flex">
                                                                <div className='text-[18px] font-semibold flex justify-between'>
                                                                    <p>
                                                                        Current Location
                                                                    </p>
                                                                    <p className='text-[14px]'>
                                                                        {_product.time}
                                                                    </p>
                                                                </div>
                                                                <div className='text-[12px] flex justify-between'>
                                                                    <p>
                                                                    {_product.location}
                                                                    </p>
                                                                    <p>
                                                                        condition: {_product.condition.condition}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className='font-bold text-md'>
                            Wallet not connected
                        </h1>
                        <p className='text-sm'>
                            Get started by connecting your wallet first
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Track;
