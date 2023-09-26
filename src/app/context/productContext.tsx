'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useWalletClient, usePublicClient, WalletClient, useWaitForTransaction } from 'wagmi';
import { Address, getContract } from 'viem';
import {AyaChainAbi} from './AyaChainAbi';
import {NFTStorage, File} from 'nft.storage';

const AyaChainAddress = "0xd086dAB59F3d183b77c14E6FbbacC421adCD1634";

export interface IProductInfo {
    id?: number,
    businessName: string;
    receiversAddress: Address;
    intermediariesWallet: Address;
    condition: string;
    yourLocation: string;
    receiversLocation: string;
    intermediariesLocation: string;
    productImage: File;
    status?: string;
}

export interface IProductHistory {
    location: string, 
    condition: {
        condition: string, 
        image: File
    }, 
    time: string
}

interface ProductContextType {
    products: IProductInfo[];
    addProduct: (product: ProductInfo) => void;
    shipProduct: (product: ProductInfo, location: string, condition: string) => void;
    updateProduct: (product: ProductInfo, location: string, condition: string) => void;
    deliverProduct: (product: ProductInfo, condition: string) => void;
    getProductHistory: (productId: number) => Promise<IProductHistory[]>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
    const [walletClient, setWalletClient] = useState<WalletClient>();

    const [products, setProducts] = useState<ProductInfo[]>([]);
    const publicClient = usePublicClient();
    useWalletClient({
        onSuccess(data) {
            if(data) {
                setWalletClient(data);
            }
        },
    });

    useEffect(() => {
        getUserProducts();
    }, [walletClient]);

    const formatIpfsUrl = (url: string) => {
        return "https://ipfs.io/ipfs/" + url.slice(7); 
    }

    const uploadCondition = async(name: string, condition: string, image: File) => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEzRUNiM2JkNTg0ZDY0REExRTQ5QTNGMTUxMWM2MTYxMDc3OWI2QUIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MDE1ODA5NTA0NSwibmFtZSI6Im5mdEhhY2sifQ.oKwSim4KHdU7Nh30fvxaCCjTLryTV0lItRdM4idE994'; // your API key from https://nft.storage/manage

        const storage = new NFTStorage({ token });
        const metadata = await storage.store({
            name,
            description: condition,
            image
        })
        return metadata.url;
    }

    const getConditions = async (conditionIpfsUrl: string): Promise<{condition: string, image: File}> => {
        const formatedUrl = formatIpfsUrl(conditionIpfsUrl);
        const res = await fetch(formatedUrl);
        const conditions = await res.json();
        const imageBlob = await (await fetch(formatIpfsUrl(conditions.image))).blob();
        const image = new File([imageBlob], conditions.name + ".png", { type: imageBlob.type });
        return {
            condition: conditions.description,
            image
        }
    }

    const getUserProducts = async() => {
        const contract = getContract({
            address: AyaChainAddress,
            abi: AyaChainAbi,
            publicClient,
            walletClient
        });
        const res = await contract.read.getProducts();
        const userAddress = walletClient?.account.address;
        const userProducts = res.filter((p) => (p.intermediary == userAddress || p.distributor == userAddress || p.customer == userAddress));
        const _products: ProductInfo[] = [];
        for(let i = 0; i < userProducts.length; i++) {
            const _product = userProducts[i];
            const status = _product.state == 0 ? "Created" : _product.state == 1 ? "Shipped" : "Delivered"; 
            const conditions = await getConditions(_product.condition);
            _products.push({
                id: Number(_product.id),
                businessName: _product.name,
                receiversAddress: _product.customer,
                intermediariesWallet: _product.intermediary,
                condition: conditions.condition,
                yourLocation: _product.currentLocation,
                intermediariesLocation: _product.currentLocation,
                receiversLocation: _product.deliveryLocation,
                productImage: conditions.image,
                status
            })
        }
        setProducts(_products);
    }
    
      
    const addProduct = async(product: ProductInfo) => {
        const contract = getContract({
            address: AyaChainAddress,
            abi: AyaChainAbi,
            publicClient,
            walletClient
        })
        const conditionUrl = await uploadCondition(product.businessName, product.condition, product.productImage);
        const txHash = await contract.write.addProduct([
          product.businessName,
          product.receiversAddress,
          product.intermediariesWallet || walletClient?.account.address,
          conditionUrl,
          product.yourLocation,
          product.receiversLocation
        ]);
        await publicClient.waitForTransactionReceipt({hash: txHash});
        getUserProducts();
    };

    const shipProduct = async(product: ProductInfo, location: string, condition: string) => {
        const contract = getContract({
            address: AyaChainAddress,
            abi: AyaChainAbi,
            publicClient,
            walletClient
        })
        const conditionUrl = await uploadCondition(product.businessName, condition, product.productImage);
        const shippedDate = new Date();
        if(product.id != undefined) {
            const txHash = await contract.write.shipProduct([
              BigInt(product.id),
              conditionUrl,
              location,
              BigInt(Math.round(shippedDate.getTime() / 1000))
            ]);
            await publicClient.waitForTransactionReceipt({hash: txHash});
            getUserProducts();
        }
    };

    const updateProduct = async(product: ProductInfo, location: string, condition: string) => {
        const contract = getContract({
            address: AyaChainAddress,
            abi: AyaChainAbi,
            publicClient,
            walletClient
        })
        const conditionUrl = await uploadCondition(product.businessName, condition, product.productImage);
        if(product.id != undefined) {
            const txHash = await contract.write.updateProduct([
              BigInt(product.id),
              conditionUrl,
              location
            ]);
            await publicClient.waitForTransactionReceipt({hash: txHash});
            getUserProducts();
        }
    };

    const deliverProduct = async(product: ProductInfo, condition: string) => {
        const contract = getContract({
            address: AyaChainAddress,
            abi: AyaChainAbi,
            publicClient,
            walletClient
        })
        const conditionUrl = await uploadCondition(product.businessName, condition, product.productImage);
        if(product.id != undefined) {
            const txHash = await contract.write.deliverProduct([
              BigInt(product.id),
              conditionUrl,
            ]);
            await publicClient.waitForTransactionReceipt({hash: txHash});
            getUserProducts();
        }
    };

    const getProductHistory = async(productId: number) => {
        const contract = getContract({
            address: AyaChainAddress,
            abi: AyaChainAbi,
            publicClient
        });
        const histories = await contract.read.getHistory([BigInt(productId)]);
        const formatedHistories: IProductHistory[] = [];
        for(let i = 0; i < histories.length; i++) {
            const time = new Date(Number(histories[i].timestamp) * 1000);
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);

            const formattedTime = time.toLocaleString('en-GB', { timeStyle: 'short' });

            let timeText;

            if (time.toDateString() === now.toDateString()) {
                timeText = `Today, ${formattedTime}`;
            } else if (time.toDateString() === yesterday.toDateString()) {
                timeText = `Yesterday, ${formattedTime}`;
            } else {
                timeText = time.toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
            }
            formatedHistories.push({
                location: histories[i].location,
                time: timeText,
                condition: await getConditions(histories[i].condition)
            })
        }
        return formatedHistories;
    }
    

    return (
        <ProductContext.Provider value={{ products, addProduct, shipProduct, updateProduct, deliverProduct, getProductHistory }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};
