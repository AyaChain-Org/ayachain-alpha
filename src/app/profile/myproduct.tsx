/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import CustomButton from '../components/common/button';
import { IProductInfo, useProductContext } from '../context/productContext';
import { UpdateModal } from '../components/updateModal';

const MyProduct: React.FC = () => {
    const { address } = useAccount();
    const { products } = useProductContext();
    const [modalType, setModalType] = useState<'ship' | 'update' | 'deliver'>('update');
    const [productToUpdate, setProductToUpdate] = useState<IProductInfo>(products[0]);
    const [updateModalActive, setUpdateModalActive] = useState(false);

    const closeUpdateModal = () => {
        setUpdateModalActive(false);
    }

    const openUpdateModal = (modalType: 'ship' | 'update' | 'deliver', product: IProductInfo) => {
        setModalType(modalType);
        setProductToUpdate(product);
        setUpdateModalActive(true);
    }

    return (
        <div className='flex flex-col pt-8 pl-8'>
            {updateModalActive && <UpdateModal product={productToUpdate} modalType={modalType} onClose={closeUpdateModal}/>}
            <div className='font-bold text-md'>
                {address ?
                    `My Products`
                    :
                    'Wallet not connected'
                }
            </div>
            {products.length > 0 ? (
                <div className="flex gap-3 flex-wrap-reverse">
                    {products.map((product, index) => (
                        <div key={index} className='bg-white rounded-[16px] border-[#0000001A] flex-col flex w-[340px] p-4 text-[16px] gap-2'>
                            {product.productImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={URL.createObjectURL(new File([product.productImage], 'product.png', { type: 'image/png' }))}
                                    alt='Product Image'
                                    className='w-full h-[250px] rounded-[12px] bg-cover object-cover'
                                />
                            )}
                            <p className='font-semibold my-2'>{product.businessName}</p>
                            <div className='between text-[14px]'>
                                <p className=''>Product ID:</p>
                                <p className="font-semibold">{String(product.id).padStart(10, "0")}</p>
                            </div>
                            <div className='between text-[14px]'>
                                <p className='text-[14px] break-all'>Receiver&rsquo;s Address:</p>
                                <a href={`https://scan.pegotest.net/address/${product.receiversAddress}`} target='_blank'>
                                {
                                    address == product.receiversAddress ?
                                    <span className='font-semibold text-blue'>you</span> :
                                    <span className='font-semibold text-blue'>{product.receiversAddress.slice(0, 6)}..</span>
                                }
                                </a>
                            </div>
                            <div className='between text-[14px]'>
                                <p>Receiver&rsquo;s Location:</p>
                                <p className='font-semibold'>{product.receiversLocation}</p>
                            </div>
                            <div className='flex flex-col'>
                                <div className='between text-[14px]'>
                                    <p>Status</p>
                                    <p className='font-semibold'>{product.status}</p>
                                </div>
                                { product.intermediariesWallet == address &&
                                    <div className='w-full border-[#0000001A] border-t py-3 mt-3'>
                                        { product.status == "Created" ?
                                            <CustomButton onClick={() => openUpdateModal('ship', product)} background='#2F7AEA' borderRadius='8px' textColor='#fff'>Ship product</CustomButton>
                                            :
                                            <CustomButton onClick={() => openUpdateModal('update', product)} background='#2F7AEA' borderRadius='8px' textColor='#fff'>Update product</CustomButton>
                                        }
                                    </div>
                                }
                            </div>
                        </div>  
                    ))}
                </div>
            ) : (
                <div className=''>
                    <p className='text-sm leading-[line-height: 154%]'>
                        Here you have the information about all your deployed products
                    </p>
                </div>
            )}
        </div>);
};

export default MyProduct;
