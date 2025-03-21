import React, { useState, useEffect } from 'react'
import Button from '../../../components/shared/button'
import { useQueryClient } from "@tanstack/react-query"
import { toast } from 'react-toastify'
import { BiUpload } from 'react-icons/bi'
import { useFetchCategory } from '../../../hooks/queries/category'
import { handlePostCategory, handlePostCategoryImage } from '../../../services/category'
// import { getCategories, createCategory, updateCategoryPicture } from '../../../services/categories' 


// const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.readAsDataURL(file)
//     reader.onload = () => resolve(reader.result)
//     reader.onerror = error => reject(error)
//   })
// }

function CategoryDashboard() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient();
  const [loads, setLoads] = useState(false)
  const [previews, setPreviews] = useState(null);
  const [selectedImageDisplay, setSelectedImageDisplay] = useState(null);
  const { data: getCategory, isPending, isError } = useFetchCategory()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',

  })
  const [updatedPicture, setUpdatedPicture] = useState(null)

  console.log(getCategory)
  const handleImageChangeDisplay = (event) => {
    const file = event.target.files[0];
    setSelectedImageDisplay(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUploadDisplay = async () => {
    if (!previews) {
      toast.error("Please select an image to upload.");
      return;
    }

    const base64Image = previews.split(",")[1];

    try {
      setLoads(true);
      console.log(base64Image);
      const response = await handlePostCategoryImage(selectedCategory.id, { attachment_type: 'products', image: base64Image })


      if (response) {
        toast.success("Image uploaded successfully!");
        queryClient.invalidateQueries(["category"]);
        setShowUpdateModal(false)
      } else {
        toast.error("Failed to upload the image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      setLoads(false);
      setSelectedImageDisplay(null);
      setPreviews(null);
    }
  };
  const handleCreateCategory = async () => {
    try {
      setLoading(true)
      const payload = {
        name: newCategoryData.name,

      }
      await handlePostCategory(payload)
      toast.success('Category created successfully')
      queryClient.invalidateQueries(["category"]);
      setShowCreateModal(false)
      setNewCategoryData({ name: '' })

    } catch (error) {
      toast.error('Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenUpdateModal = (category) => {
    setSelectedCategory(category)
    setShowUpdateModal(true)
  }



  return (

    <div className="px-6">
      {/* Header */}
      <div className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <Button label="Create Category" onClick={() => setShowCreateModal(true)} variant="solid" />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getCategory?.data.map((category) => (
          <div
            key={category.id}
            className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <img
                src={category.display_attachment_url || 'https://via.placeholder.com/150?text=No+Image'}
                alt={category.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <Button
                label="Update Picture"
                onClick={() => handleOpenUpdateModal(category)}
                variant="outline"
                size="sm"
              />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-gray-800">{category.name}</h3>
            <p className="mt-2 text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Create New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>


            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button label="Cancel" onClick={() => setShowCreateModal(false)} variant="outline" />
              <Button label="Create" loading={loading} onClick={handleCreateCategory} variant="solid" />
            </div>
          </div>
        </div>
      )}

      {/* Update Display Picture Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Update Display Picture</h2>
            <div className="space-y-4">
              <div className="flex gap-10">
                <div className="relative w-40 h-40 flex items-center justify-center border border-dashed border-gray-400 rounded-lg hover:bg-gray-100 transition">
                  <label className="flex flex-col items-center cursor-pointer">
                    <BiUpload size={24} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChangeDisplay}
                    />
                  </label>
                </div>
                {previews && (
                  <div className="flex flex-col items-center">
                    <img
                      src={previews}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-md"
                    />

                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button label="Cancel" onClick={() => setShowUpdateModal(false)} variant="outline" />
              <Button
                onClick={handleUploadDisplay}
                size="sm"
                label="Upload"
                className="mt-2"
                disabled={loads}
                loading={loads}
                variant='solid'
              >
                {loads ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryDashboard
