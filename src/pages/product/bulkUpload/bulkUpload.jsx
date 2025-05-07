import React, { useState } from 'react';
import { BiUpload, BiDownload } from 'react-icons/bi';
import { FaEye, FaPencilAlt } from 'react-icons/fa';
import axiosInstance from '../../../../store/axiosInstance';
import Modal from '../../../components/shared/modal';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

import { handleBulkProduct, handleProductBulkImages, handleProductEditBulk } from '../../../services/product';
import { useFetchBulkDownload } from '../../../hooks/queries/product';
import Button from '../../../components/shared/button';

const sampleProducts = [
  { id: 1, name: 'Anysew AS-ES6 Table top Embroidery Machine', category: 'Fashion', price: 2300000, status: 'Active', image: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Konica Minolta Bizhub C284e', category: 'Tech', price: 672000, status: 'Active', image: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Executive Office Chair', category: 'Furniture', price: 45000, status: 'Inactive', image: 'https://via.placeholder.com/40' },
  { id: 4, name: 'Air Conditioner 1.5 Ton', category: 'Home Appliances', price: 125000, status: 'Active', image: 'https://via.placeholder.com/40' },
];


export default function BulkProductUpload() {
  const { data: getBulkProduct, isPending, isError } = useFetchBulkDownload();
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
        '/admin/products/upload-template',
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
      const response = await handleBulkProduct('/admin/bulk-upload', formData
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
      const response = await handleProductEditBulk('/admin/bulk-edit', formData
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
              disabled={isPending || !getBulkProduct}
            >
              {isPending ? 'Preparing…' : 'Download Template'}
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
              <th className="px-4 py-3">Image</th>


              <th className="px-4 py-3">Image Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {productBulk.map(p => (
              <tr key={p.id} className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow">

                <td className="px-4 py-3 align-middle font-medium text-gray-800">{p.id}</td>
                <td className="px-4 py-3 align-middle text-sm text-black">{p.name}</td>
                {/* <td className="px-4 py-3 align-middle">
                  <span className={`px-3 py-1 text-xs rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{p.status}</span>
                </td> */}
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
                {/* <td className="px-4 py-3 align-middle">
                  <span className={`px-3 py-1 text-xs rounded-full ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{p.status}</span>
                </td> */}
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
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <Button
            onClick={uploadExcel}
            label={excelFile ? `Upload "${excelFile.name}"` : "Select a file"}
            disabled={!excelFile}
          />
        </div>
      </Modal>
      <Modal isOpen={showBulkEditModal} onClose={() => setShowBulkEditModal(false)} title="Upload Edited Bulk Products">

        <div className="flex flex-col space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelChanges}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-red-500 text-xs">Kindly note that once an edited product is uploaded, it will automatically replace the previous version.</p>

          <Button
            onClick={uploadEditedExcel}
            label={excelEditFile ? `Upload "${excelEditFile.name}"` : "Select a file"}
            disabled={!excelEditFile}
          />
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
