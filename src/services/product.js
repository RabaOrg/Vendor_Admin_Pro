import axiosInstance from "../../store/axiosInstance";

export const handleProduct = async (page , perPage, search ) => {
  const data = await axiosInstance.get(`admin/products?page=${page}&perPage=${perPage}&search=${search || ""}`);
  return data.data;
}
export const handleMetaProduct = async (page , perPage, search ) => {
  const { data } = await axiosInstance.get(`admin/products?page=${page}&perPage=${perPage}`);
  return data;
}
export const handleBulkProduct = async (url, formInfo) => {
  return axiosInstance.post(url, formInfo);
};

export const handleProductBulk = async () => {
  const { data } = await axiosInstance.get(`/admin/products/download`, {
    responseType: 'blob',  
  });
  return data;
};
export const handleProductBulkImages = async (formInfo) => {
  return axiosInstance.post(`/admin/bulk-upload-images`, formInfo);
 
}
export const handleProductEditBulk = async (url, formInfo) => {
  return axiosInstance.put(url, formInfo);
 
}
export const handleCreateProduct = async (formInfo) => {
  return axiosInstance.post(
   "/admin/product",
    formInfo
  );
};

export const handleUpdateProduct = async (formInfo) => {
  return axiosInstance.put(
   "/admin/product",
    formInfo
  );
};
export const handleDeleteProduct = async (id, productId) => {
  return axiosInstance.delete(
   `/admin/products/${id}/attachments/${productId}`,
   
  );
};



export const handleGetSingleProduct = async (Id) => {
     const { data } = await axiosInstance.get(`/admin/products/${Id}`);
     
    return data;
}
export const handleGetCategories = async (Id) => {
     const { data } = await axiosInstance.get(`/admin/categories`);
     
    return data.data.data;
}

export const handleProductImage = async (id, formInfo) => {
  return axiosInstance.post(
   `/admin/products/${id}/attachments`,
    formInfo
  );
};
export const handleDeleteImage = async (id, attachmentId, formInfo) => {
  return axiosInstance.delete(
   `/admin/products/${id}/attachments/${attachmentId}`,
    formInfo
  );
};
export const handleDeleteImageDisplay = async (id,  formInfo) => {
  return axiosInstance.delete(
   `/admin/products/${id}/display-attachment`,
    formInfo
  );
};

export const handleDisplayProductImage = async (id, formInfo) => {
  return axiosInstance.post(
   `/admin/products/${id}/display-attachments`,
    formInfo
  );
};
