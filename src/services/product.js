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

// Helper to parse price (remove commas and ensure valid number)
const parsePrice = (price) => {
  if (!price) return '';
  // Remove all non-digit characters except decimal point
  const cleaned = String(price).replace(/[^\d.]/g, '');
  // Ensure it's a valid number
  const numValue = Number(cleaned);
  if (isNaN(numValue)) return '';
  return String(numValue);
};

// Helper to convert empty strings to null for bigint fields
const sanitizeBigintField = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  return value;
};

export const handleUpdateProduct = async (formInfo) => {
  // Check if formInfo has files (images) - if so, use FormData
  const hasFiles = formInfo.selectedDisplayImage || (formInfo.selectedImages && formInfo.selectedImages.length > 0);
  
  if (hasFiles) {
    const formData = new FormData();
    
    // Append all product fields
    Object.keys(formInfo).forEach(key => {
      if (key !== 'selectedDisplayImage' && key !== 'selectedImages' && key !== 'previewImages' && key !== 'displayPreview') {
        let value = formInfo[key];
        
        // Parse price field to remove commas and ensure it's a valid number
        if (key === 'price') {
          value = parsePrice(value);
          // Ensure it's a valid number string
          if (value && !isNaN(value)) {
            value = String(Number(value)); // Convert to number then back to string to remove any formatting
          }
        }
        
        // Convert empty strings to null for bigint fields
        if (key === 'category_id' || key === 'vendor_id' || key === 'repayment_plan_id') {
          value = sanitizeBigintField(value);
          // Always append bigint fields, even if null (send as empty string for backend to convert)
          formData.append(key, value === null ? '' : String(value));
          return; // Skip the rest of the loop for these fields (use return in forEach, not continue)
        }
        
        if (value !== undefined && value !== null && value !== '') {
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
    // Parse price and sanitize bigint fields before sending
    const productData = {
      ...formInfo,
      price: parsePrice(formInfo.price),
      // Convert empty strings to null for bigint fields
      category_id: sanitizeBigintField(formInfo.category_id),
      vendor_id: sanitizeBigintField(formInfo.vendor_id),
      repayment_plan_id: sanitizeBigintField(formInfo.repayment_plan_id)
    };
    return axiosInstance.put(
      `/api/admin/products/${formInfo.id}`,
      productData
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
