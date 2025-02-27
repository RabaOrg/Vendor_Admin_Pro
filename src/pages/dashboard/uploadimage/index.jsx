import React, { useState } from 'react';
import Button from '../../../components/shared/button';
import { BiUpload } from 'react-icons/bi';
import { Card } from 'flowbite-react';
import { toast } from 'react-toastify';
import { handleCustomerImage } from '../../../services/customer';
// Import your API functions here
// import { handleProductImage, handleDisplayImage } from '../../../services/imageService';

function ImageUpload({ id }) {
    const [imageId, setImageId] = useState('');
    const [productLoading, setProductLoading] = useState(false);
    const [displayLoading, setDisplayLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedImageDisplay, setSelectedImageDisplay] = useState(null);
    const [displayPreview, setDisplayPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageChangeDisplay = (event) => {
        const file = event.target.files[0];
        setSelectedImageDisplay(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setDisplayPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!preview) {
            toast.error('Please select an image to upload.');
            return;
        }

        const base64Image = preview.split(',')[1];

        try {
            setProductLoading(true);
            console.log('Uploading product image:', base64Image);
            console.log('Image ID:', imageId);

            const response = await handleCustomerImage(id, { attachment_type: 'business_location_pictures', image: base64Image });
            console.log(response);
            if (response && response.status === 200) {
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Failed to upload the image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('An error occurred while uploading the image.');
        } finally {
            setProductLoading(false);
        }
    };

    const handleUploadDisplay = async () => {
        if (!displayPreview) {
            toast.error('Please select an image to upload.');
            return;
        }

        const base64Image = displayPreview.split(',')[1];

        try {
            setDisplayLoading(true);
            console.log('Uploading display image:', base64Image);

            const response = await handleCustomerImage(id, { attachment_type: 'nin', image: base64Image });
            console.log(response);
            if (response && response.status === 200) {
                toast.success('ID image uploaded successfully!');
            } else {
                toast.error('Failed to upload the display image. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading display image:', error);
            toast.error('An error occurred while uploading the display image.');
        } finally {
            setDisplayLoading(false);
        }
    };

    return (
        <div className='p-4'>
            <Card className="w-full h-full bg-white">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload business location pictures & Means Of Identification </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Ensure the images meet the required format and size.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Product Image</h3>
                        <div className="flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg p-4 h-40">
                            {preview ? (
                                <img src={preview} alt="Product Preview" className="max-h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-sm">No image selected</span>
                            )}
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                id="productImageInput"
                                onChange={handleImageChange}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('productImageInput').click()}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <BiUpload className="mr-2" size={20} />
                                Select Image
                            </button>
                            <Button
                                label="Upload"
                                variant="solid"
                                loading={productLoading}
                                onClick={handleUpload}
                                size="md"
                                className="px-4 py-2"
                            />
                        </div>
                    </div>

                    {/* Display Image Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Upload any means of Identification</h3>
                        <div className="flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg p-4 h-40">
                            {displayPreview ? (
                                <img src={displayPreview} alt="Display Preview" className="max-h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-sm">No image selected</span>
                            )}
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                id="displayImageInput"
                                onChange={handleImageChangeDisplay}
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('displayImageInput').click()}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <BiUpload className="mr-2" size={20} />
                                Select Image
                            </button>
                            <Button
                                label="Upload"
                                variant="solid"
                                loading={displayLoading}
                                onClick={handleUploadDisplay}
                                size="md"
                                className="px-4 py-2"
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default ImageUpload;
