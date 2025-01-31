import axiosInstance from "../../store/axiosInstance";

export const handleProduct = async (page , perPage ) => {
  const data = await axiosInstance.get(`admin/products?page=${page}&perPage=${perPage}`);
  return data;
}
export const handleMetaProduct = async (page , perPage ) => {
  const { data } = await axiosInstance.get(`admin/products?page=${page}&perPage=${perPage}`);
  return data;
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

export const handleDisplayProductImage = async (id, formInfo) => {
  return axiosInstance.post(
   `/admin/products/${id}/display-attachments`,
    formInfo
  );
};
