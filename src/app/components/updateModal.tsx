import React, { useState } from 'react'
import ImagePreview from '../profile/common/ImagePreview'
import LoadingButton from '../profile/common/addProduct';
import { toast } from 'react-toastify';
import { IProductInfo, useProductContext } from '../context/productContext';

export const UpdateModal = ( { product, modalType, onClose}: { product: IProductInfo, modalType: "ship" | "update" | "deliver", onClose: () => void }) => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const {shipProduct, updateProduct, deliverProduct} = useProductContext();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target as HTMLInputElement;
        const previewContainer = document.getElementById('image-preview');
        setIsUploading(true);
    
        if (fileInput?.files?.[0]) {
            const file = fileInput.files[0];
            
            // Update the selected image file in state
            setSelectedImageFile(file);

            // Set the image name and size in state
            setImageName(file.name);
            setImageSize(formatBytes(file.size));

            const reader = new FileReader();
    
            try {
                reader.onload = function (e) {
                    setIsUploading(false);
                    const image = document.createElement('img');
                    image.src = e.target?.result as string;
                    image.className = 'preview-image w-[100px] h-[100px] bg-cover rounded-[12px]';
    
                    // Clear previous previews
                    while (previewContainer?.firstChild) {
                        previewContainer.removeChild(previewContainer.firstChild);
                    }
    
                    // Append the new image
                    previewContainer?.appendChild(image);
                };
    
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error loading image:', error);
            }
        }
    };

    // Helper function to format bytes to KB, MB, etc.
    const formatBytes = (bytes: number | undefined) => {
    if (bytes === undefined) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const handleDeleteImage = () => {
        // Clear the image preview
        const previewContainer = document.getElementById('image-preview');
        while (previewContainer?.firstChild) {
            previewContainer.removeChild(previewContainer.firstChild);
        }
    
        // Clear the file input value
        const fileInput = document.getElementById('product-image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    
        // Clear the state variables
        setImageName(null);
        setImageSize(null);
    
        setSelectedImageFile(null);
    };

    // a function to check if all input fields are empty
    const areInputFieldsEmpty = () => {
        return (
            !((document.getElementById('condition') as HTMLInputElement)?.value) &&
            !((document.getElementById('location') as HTMLInputElement)?.value) 
        );
    };

    const update = async () => {
        const location = (document.getElementById('location') as HTMLInputElement)?.value;
        const condition = (document.getElementById('condition') as HTMLSelectElement)?.value;
        setIsUpdating(true);
        

        // Check if an image has been uploaded
        if (!selectedImageFile) {
          alert('Please upload an image.');
          return;
        }
        modalType == 'ship' ?
        await shipProduct(product, location, condition) :
        modalType == 'update' ? 
        await updateProduct(product, location, condition) :
        await deliverProduct(product, condition);


        // await updateProduct()
        setIsUpdating(false);

        const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 500));
        toast.promise(
            resolveAfter3Sec,
            {
                pending: 'Updating product',
                success: 'Product updated successfully 👌',
                error: 'Transaction failed 🤯'
            }
        )

        const updateSuccessful = true;

        if (updateSuccessful) {
            // Clear input fields
            const inputFields = [
                'location',
                'condition'
            ];
    
            inputFields.forEach((fieldName) => {
                const inputElement = document.getElementById(fieldName) as HTMLInputElement;
                if (inputElement) {
                    inputElement.value = '';
                }
            });
            setIsUpdating(false);
    
            // Clear image preview
            handleDeleteImage();
        }
      onClose();      
    };
  return (
    <div className='modal' onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="between">
          <p className='text-[20px]'>
            {modalType.slice(0, 1).toUpperCase() + modalType.slice(1)} modal
          </p>
          <div className="p-2 rounded-full border w-[30px] h-[30px] center">
            <p className='text-[20px] cursor-pointer' onClick={onClose}>x</p>
          </div>
        </div>
        <div className='center flex-col overflow-x-hidden mt-6'>
          <div className='flex flex-wrap w-full gap-5 overflow-x-hidden rounded-[12px]'>
            <div className='flex rounded-lg w-[100%] flex-col gap-3 border border-[#0000001A] px-[20px] py-[10px]'>
                <label htmlFor="location" className='text-gray text-[16px] leading-[15px]'>Location</label>
                <input type="text" name="location" id="location" placeholder='Enter product location' className='outline-none text-black text-[16px] font-semibold leading-[16px]' />
            </div>
            <div className="w-full">
              <div className='flex rounded-lg flex-col gap-3 border border-[#0000001A] px-[20px] py-[10px]'>
                 <label htmlFor="location" className='text-gray text-[16px] leading-[15px]'>Condition</label>
                <select name="condition" id="condition" className='outline-none pr-5 py-3 text-black'>
                  <option value="" disabled selected style={{ display: "none" }}>Select Product Condition</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
            </div>
            <div className="w-full">
              <div className="custom-file-upload">
                  <label htmlFor="product-image" className="file-label">
                    <p className='flex'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 41 41" fill="none">
                        <path d="M27.1671 27.1665L20.5004 20.4998M20.5004 20.4998L13.8338 27.1665M20.5004 20.4998V35.4998M34.4838 31.1498C36.1093 30.2636 37.3935 28.8613 38.1335 27.1642C38.8736 25.4671 39.0274 23.5719 38.5708 21.7776C38.1141 19.9834 37.0729 18.3923 35.6115 17.2556C34.1502 16.1188 32.3519 15.501 30.5004 15.4998H28.4004C27.8959 13.5485 26.9557 11.737 25.6503 10.2015C24.345 8.6659 22.7085 7.44623 20.8639 6.63416C19.0193 5.82208 17.0147 5.43874 15.0006 5.51295C12.9866 5.58715 11.0155 6.11698 9.23572 7.06259C7.4559 8.0082 5.91361 9.34498 4.72479 10.9724C3.53598 12.5999 2.73157 14.4757 2.37206 16.4588C2.01254 18.4419 2.10726 20.4807 2.64911 22.4219C3.19096 24.3631 4.16583 26.1563 5.50042 27.6665" stroke="#8B8D8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg> 
                      Upload image or video <span className="text-blue"> here</span>
                      </p>
                  </label>
                  <input type="file" name="product-image" id="product-image" accept="image/*" className="file-input" onChange={handleFileChange} />
                </div>
                {selectedImageFile && (
                  <div className="relative">
                    <ImagePreview productImage={selectedImageFile} onDeleteImage={handleDeleteImage} />
                    <div className="absolute left-[130px] flex font-semibold top-[40%]">
                    <p>{imageName}</p>
                    <p> ({imageSize})</p>
                  </div>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-1 mt-6'>
            <button
                className={`${
                    areInputFieldsEmpty()
                        ? 'bg-[#B9D5FE] cursor-not-allowed'
                        : 'bg-[#2F7AEA] cursor-pointer hover:scale-95 transition duration-300'
                } text-[#FFFFFF] p-[1rem] rounded-lg center relative`}
                onClick={update}
                disabled={isUploading || isUpdating}
            >
                {isUpdating ? (
                    <LoadingButton />
                ) : (
                    isUploading ? 'Uploading Image' : modalType == 'ship' ? 'Ship Product' : modalType == 'update' ? 'Update Product' : 'Deliver Product'
                )}
            </button>
        </div>
      </div>
    </div>
  )
}
