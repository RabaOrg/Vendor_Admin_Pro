import React, { useState } from 'react';
import { BiUpload, BiDownload } from 'react-icons/bi';
import { FaEye, FaPencilAlt } from 'react-icons/fa';
import axiosInstance from '../../../../store/axiosInstance';
import Modal from '../../../components/shared/modal';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

import { handleBulkProduct, handleProductBulkImages, handleProductEditBulk } from '../../../services/product';
import Button from '../../../components/shared/button';

const sampleProducts = [
  { id: 1, name: 'Anysew AS-ES6 Table top Embroidery Machine', category: 'Fashion', price: 2300000, status: 'Active', image: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Konica Minolta Bizhub C284e', category: 'Tech', price: 672000, status: 'Active', image: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Executive Office Chair', category: 'Furniture', price: 45000, status: 'Inactive', image: 'https://via.placeholder.com/40' },
  { id: 4, name: 'Air Conditioner 1.5 Ton', category: 'Home Appliances', price: 125000, status: 'Active', image: 'https://via.placeholder.com/40' },
];


export default function BulkProductUpload() {
  // Removed useFetchBulkDownload - it was auto-fetching on mount unnecessarily
  const [products] = useState(sampleProducts);
  const [load, setLoad] = useState(false)
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [productBulk, setProductBulk] = useState([])
  const [uploadedImages, setUploadedImages] = useState({});

  const [productEditBulk, setProductEditBulk] = useState([])
  const [imageFileMap, setImageFileMap] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelEditFile, setExcelEditFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadingForId, setUploadingForId] = useState(null);
  const [loading, setLoading] = useState(false);

  const allSelected = selectedIds.length === products.length;
  // console.log(getBulkProduct)
  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const handleSubmitAllImages = async () => {
    const entries = Object.entries(imageFileMap);
    if (entries.length === 0) {
      toast.warn("No images to upload.");
      return;
    }

    try {
      setLoading(true);

      const imageUploadPromises = entries.map(([productId, file]) => {
        return new Promise((resolve, reject) => {
          if (!file) return resolve(null);

          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve({
              product_id: productId,
              attachment_type: 'products',
              is_display_image: true,
              image: base64,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const imageDataArray = (await Promise.all(imageUploadPromises)).filter(Boolean);

      if (imageDataArray.length === 0) {
        toast.warn("No valid images to upload.");
        return;
      }

      await handleProductBulkImages({ products: imageDataArray }).then(res => {
        const uploaded = res?.data?.data?.successful || [];


        const newImageMap = {};
        uploaded.forEach(img => {
          newImageMap[img.product_id] = img.url;
        });


        setUploadedImages(prev => ({ ...prev, ...newImageMap }));
      });

      toast.success("All images uploaded successfully.");
      setImageFileMap({});
    } catch (error) {
      console.error(error);
      toast.error("Error uploading images.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : products.map(p => p.id));
  };

  const formatPrice = (value) => value.toLocaleString();

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };
  const handleExcelChanges = (e) => {
    setExcelEditFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };
  const handleBulkDownload = async () => {

    try {
      toast.info('Preparing download…');


      const response = await axiosInstance.get(
        '/api/admin/products/upload-template',
        { responseType: 'arraybuffer' }
      );


      const blob = new Blob(
        [response.data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );

      saveAs(blob, 'bulk-products-template.xlsx');

      toast.success('Download started.');
    } catch (err) {
      console.error(err);
      toast.error('Download failed.');
    }

    // if (!getBulkProduct) return;
    // const url = URL.createObjectURL(getBulkProduct);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'bulk-products-template.xlsx';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };




  const uploadExcel = async () => {
    if (!excelFile) return;
    const formData = new FormData();
    formData.append('products', excelFile);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const response = await handleBulkProduct('/api/admin/products/bulk-upload', formData
      );
      console.log(response.data.data)
      setProductBulk(response.data.data.products)
      toast.success('Products uploaded successfully.');
      setShowBulkModal(false);
      setExcelFile(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { message, errors } = error.response.data;
        setValidationErrors(errors);
        setShowErrorModal(true);
        setShowBulkModal(false)
        toast.error(message);
      } else {
        toast.error('Something went wrong uploading the file.');
      }
    }
  };
  const uploadEditedExcel = async () => {
    if (!excelEditFile) return;
    const formData = new FormData();
    formData.append('products', excelEditFile);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const response = await handleProductEditBulk('/api/admin/products/bulk-edit', formData
      );
      console.log(response.data.data.results.successful)
      setProductEditBulk(response.data.data.results.successful)

      toast.success('Products uploaded successfully.');
      setShowBulkEditModal(false);
      setExcelEditFile(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { message, errors } = error.response.data;
        setValidationErrors(errors);
        setShowErrorModal(true);
        setShowBulkModal(false)
        toast.error(message);
      } else {
        toast.error('Something went wrong uploading the file.');
      }
    }
  };
  const handleImageChangeForProduct = (productId, file) => {
    if (!file) return;
    setImageFileMap(prev => ({ ...prev, [productId]: file }));
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) {
      toast.error("No images selected.");
      return;
    }

    try {
      setLoading(true);

      for (const file of imageFiles) {
        const reader = new FileReader();

        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            const base64 = reader.result.split(",")[1];
            try {
              const response = await handleProductBulkImages({
                product_id: uploadingForId,
                attachment_type: 'products',
                is_display_image: true,
                image: base64,
              });
              console.log(response.data.successful)
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      toast.success('Images uploaded successfully!');
      setShowImageModal(false);
      setImageFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error(error);
      toast.error('Error uploading images.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImageClick = () => {
    if (selectedIds.length === 1) {
      setUploadingForId(selectedIds[0]);
      setShowImageModal(true);
    } else {
      toast.warn('Please select exactly one product to upload an image.');
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-lg">

        <div className="flex justify-between items-center p-4 border-b">
          <h4 className="text-lg font-semibold">Product Management</h4>
          <div className="space-x-2">
            <button onClick={() => setShowBulkModal(true)} className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded">
              Upload Bulk Product
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
              onClick={handleBulkDownload}
            >
              Download Template
            </button>
            <button className="bg-[#0f5D30] hover:bg-green-900 text-white text-sm px-4 py-2 rounded" onClick={handleSubmitAllImages} disabled={loading || Object.keys(imageFileMap).length === 0}>
              {loading ? "Uploading..." : "Submit All Images"}
            </button>

          </div>
        </div>


        <div className="flex items-center p-4 space-x-4">
          <span className="font-semibold">Bulk Actions:</span>
          <div className="flex space-x-2">
            <button onClick={handleUploadImageClick} className="border border-green-500 text-green-500 text-sm hover:bg-green-50 rounded p-1 flex gap-2 pt-2">
              <BiUpload className="text-sm" />Upload Images
            </button>
            <button onClick={() => setShowBulkEditModal(true)} className="border border-blue-500 text-blue-500 text-sm hover:bg-blue-50 rounded p-1 flex gap-2 pt-2">
              <BiDownload className="text-sm" />Upload Edited Product
            </button>

          </div>

        </div>




        <table className="w-full text-left text-gray-700 border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs">

              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Dealer</th>
              <th className="px-4 py-3">Upload Image</th>
              <th className="px-4 py-3">Image Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {productBulk.length === 0 && productEditBulk.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium mb-2">No products uploaded yet</p>
                    <p className="text-gray-400 text-sm mb-4">Upload an Excel file to get started</p>
                    <button
                      onClick={() => setShowBulkModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Upload Products
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {productBulk.map(p => (
              <tr key={p.id} className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow">
                <td className="px-4 py-3 align-middle font-medium text-gray-800">{p.id}</td>
                <td className="px-4 py-3 align-middle text-sm text-black">{p.name}</td>
                <td className="px-4 py-3 align-middle text-sm text-gray-600">
                  {p.Vendor?.business_name || p.Vendor?.first_name || 'Admin'}
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center justify-center w-24 h-20 relative">
                    {imageFileMap[p.id] ? (
                      <img
                        src={URL.createObjectURL(imageFileMap[p.id])}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <button
                        onClick={() => document.getElementById(`file-input-${p.id}`).click()}
                        className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        <BiUpload className="text-3xl text-gray-400" />
                      </button>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id={`file-input-${p.id}`}
                      className="hidden"
                      onChange={(e) => handleImageChangeForProduct(p.id, e.target.files[0])}
                    />
                  </div>
                </td>

                <td className="px-4 py-3 align-middle">
                  {uploadedImages[p.id] ? (
                    <img
                      src={uploadedImages[p.id]}
                      alt="Uploaded"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm italic">No image</span>
                  )}
                </td>

              </tr>
            ))}
            {productEditBulk.map(p => (
              <tr key={p.id} className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow">
                <td className="px-4 py-3 align-middle font-medium text-gray-800">{p.id}</td>
                <td className="px-4 py-3 align-middle text-sm text-black">{p.name}</td>
                <td className="px-4 py-3 align-middle text-sm text-gray-600">
                  {p.Vendor?.business_name || p.Vendor?.first_name || 'Admin'}
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center justify-center w-24 h-20 relative">
                    {imageFileMap[p.id] ? (
                      <img
                        src={URL.createObjectURL(imageFileMap[p.id])}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <button
                        onClick={() => document.getElementById(`file-input-${p.id}`).click()}
                        className="flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        <BiUpload className="text-3xl text-gray-400" />
                      </button>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id={`file-input-${p.id}`}
                      className="hidden"
                      onChange={(e) => handleImageChangeForProduct(p.id, e.target.files[0])}
                    />
                  </div>
                </td>

                <td className="px-4 py-3 align-middle">
                  {uploadedImages[p.id] ? (
                    <img
                      src={uploadedImages[p.id]}
                      alt="Uploaded"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm italic">No image</span>
                  )}
                </td>


              </tr>
            ))}
          </tbody>
        </table>


      </div>


      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Upload Bulk Products">
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-600">
            Upload an Excel file (.xlsx or .xls) containing product information. 
            Make sure your file matches the template format.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-medium text-gray-700 mb-1">Click to select Excel file</span>
              <span className="text-xs text-gray-500">or drag and drop</span>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelChange}
                className="hidden"
                id="excel-upload"
              />
            </label>
            {excelFile && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">{excelFile.name}</span>
                  </div>
                  <span className="text-xs text-green-600">{(excelFile.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={uploadExcel}
              label={excelFile ? "Upload Products" : "Select a file first"}
              variant={excelFile ? "solid" : "outline"}
              className={excelFile ? "bg-green-600 hover:bg-green-700 text-white" : ""}
              disabled={!excelFile}
              loading={load}
            />
            <button
              onClick={() => setShowBulkModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showBulkEditModal} onClose={() => setShowBulkEditModal(false)} title="Upload Edited Bulk Products">
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-600">
            Upload an edited Excel file containing updated product information. 
            Products will be updated based on their IDs.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> Once an edited product is uploaded, it will automatically replace the previous version.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
            <label className="flex flex-col items-center cursor-pointer">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-medium text-gray-700 mb-1">Click to select Excel file</span>
              <span className="text-xs text-gray-500">or drag and drop</span>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelChanges}
                className="hidden"
                id="excel-edit-upload"
              />
            </label>
            {excelEditFile && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">{excelEditFile.name}</span>
                  </div>
                  <span className="text-xs text-green-600">{(excelEditFile.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={uploadEditedExcel}
              label={excelEditFile ? "Upload Edited Products" : "Select a file first"}
              variant={excelEditFile ? "solid" : "outline"}
              className={excelEditFile ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
              disabled={!excelEditFile}
              loading={load}
            />
            <button
              onClick={() => setShowBulkEditModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>


      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Upload Product Images</h2>

            <div className="space-y-4">
              <div className="relative flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-6 hover:bg-gray-50 transition">
                <label className="flex flex-col items-center cursor-pointer space-y-2">
                  <BiUpload size={32} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Click to Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {previews.map((src, idx) => (
                    <img key={idx} src={src} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded-lg border" />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button label="Cancel" variant="outline" onClick={() => setShowImageModal(false)} />
              <Button
                onClick={uploadImages}
                label={loading ? "Uploading..." : "Upload"}
                disabled={loading}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Validation Errors</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr className="text-gray-700">
                    <th className="p-3 text-left border-b">Row</th>
                    <th className="p-3 text-left border-b">Product Name</th>
                    <th className="p-3 text-left border-b">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {validationErrors.map((err, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{err.row}</td>
                      <td className="p-3">{err.product_name}</td>
                      <td className="p-3">
                        <ul className="list-disc ml-5 text-red-600">
                          {err.errors.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button label="Close" variant="outline" onClick={() => setShowErrorModal(false)} />
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
