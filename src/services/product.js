import axiosInstance from "../../store/axiosInstance";

export const handleProduct = async (page , perPage, search ) => {
  const data = await axiosInstance.get(`/api/admin/products?page=${page}&perPage=${perPage}&search=${search || ""}`);
  return data.data;
}
export const handleMetaProduct = async (page , perPage, search ) => {
  const { data } = await axiosInstance.get(`/api/admin/products?page=${page}&perPage=${perPage}`);
  return data;
}
export const handleBulkProduct = async (url, formInfo) => {
  return axiosInstance.post(url, formInfo, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const handleProductBulk = async () => {
  const { data } = await axiosInstance.get(`/api/admin/products/download`, {
    responseType: 'blob',  
  });
  return data;
};
export const handleProductBulkImages = async (formInfo) => {
  return axiosInstance.post(`/api/admin/bulk-upload-images`, formInfo);
}
export const handleProductEditBulk = async (url, formInfo) => {
  return axiosInstance.put(url, formInfo, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
export const handleCreateProduct = async (formInfo) => {
  return axiosInstance.post(
   "/api/admin/products",
    formInfo,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const handleUpdateProduct = async (formInfo) => {
  // Check if formInfo has files (images) - if so, use FormData
  const hasFiles = formInfo.selectedDisplayImage || (formInfo.selectedImages && formInfo.selectedImages.length > 0);
  
  if (hasFiles) {
    const formData = new FormData();
    
    // Append all product fields
    Object.keys(formInfo).forEach(key => {
      if (key !== 'selectedDisplayImage' && key !== 'selectedImages' && key !== 'previewImages' && key !== 'displayPreview') {
        const value = formInfo[key];
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (Array.isArray(value)) {
            // Handle arrays - convert to JSON string if needed
            if (value.length > 0 && typeof value[0] === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              value.forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
              });
            }
          } else {
            formData.append(key, value);
          }
        }
      }
    });
    
    // Append display image if selected
    if (formInfo.selectedDisplayImage) {
      formData.append('display_image', formInfo.selectedDisplayImage);
    }
    
    // Append additional images if selected
    if (formInfo.selectedImages && formInfo.selectedImages.length > 0) {
      formInfo.selectedImages.forEach((imageObj, index) => {
        if (imageObj.file) {
          formData.append('images', imageObj.file);
        }
      });
    }
    
    return axiosInstance.put(
      `/api/admin/products/${formInfo.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  } else {
    // No files, send as JSON
    return axiosInstance.put(
      `/api/admin/products/${formInfo.id}`,
      formInfo
    );
  }
};
export const handleDeleteProduct = async (id, productId) => {
  return axiosInstance.delete(
   `/api/admin/products/${id}/attachments/${productId}`,
   
  );
};



export const handleGetSingleProduct = async (Id) => {
     const { data } = await axiosInstance.get(`/api/admin/products/${Id}`);
     
    return data;
}
export const handleGetCategories = async (Id) => {
     const { data } = await axiosInstance.get(`/api/admin/categories`);
     
    // Return the full nested structure for proper handling
    return data.data || data;
}

export const handleProductImage = async (id, formInfo) => {
  return axiosInstance.post(
   `/api/admin/products/${id}/attachments`,
    formInfo
  );
};
export const handleDeleteImage = async (id, attachmentId, formInfo) => {
  return axiosInstance.delete(
   `/api/admin/products/${id}/attachments/${attachmentId}`,
    formInfo
  );
};
export const handleDeleteImageDisplay = async (id,  formInfo) => {
  return axiosInstance.delete(
   `/api/admin/products/${id}/display-attachment`,
    formInfo
  );
};

export const handleDisplayProductImage = async (id, formInfo) => {
  return axiosInstance.post(
   `/api/admin/products/${id}/display-attachments`,
    formInfo
  );
};
