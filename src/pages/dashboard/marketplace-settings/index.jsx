import React, { useState, useEffect } from 'react';
import { Settings, ToggleLeft, ToggleRight, Save, Loader2 } from "lucide-react";
import { toast } from 'react-toastify';
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import Button from '../../../components/shared/button';
import axiosInstance from '../../../../store/axiosInstance';

function MarketplaceSettings() {
  const queryClient = useQueryClient();
  const [showCustomProducts, setShowCustomProducts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch marketplace settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['marketplace-settings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/admin/marketplace/settings');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update settings when data is fetched
  useEffect(() => {
    if (settingsData?.data) {
      setShowCustomProducts(settingsData.data.show_custom_products || false);
    }
  }, [settingsData]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data) => {
      const { data: response } = await axiosInstance.put('/api/admin/marketplace/settings', data);
      return response;
    },
    onSuccess: () => {
      toast.success('Marketplace settings updated successfully');
      queryClient.invalidateQueries(['marketplace-settings']);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update marketplace settings');
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettingsMutation.mutateAsync({
        show_custom_products: showCustomProducts
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = () => {
    setShowCustomProducts(!showCustomProducts);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketplace Settings</h1>
        <p className="text-gray-600 mt-2 text-sm">
          Configure marketplace display settings and product visibility options.
        </p>
      </div>

      <section className="bg-white p-6 rounded-2xl shadow space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">Product Visibility Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">
                Show Custom Products
              </h3>
              <p className="text-sm text-gray-600">
                When enabled, custom products created via applications from vendors will be displayed on the landing page and dealer product pages. 
                When disabled (default), custom products will be hidden from public view.
              </p>
            </div>
            <button
              onClick={handleToggle}
              className="ml-4 flex items-center focus:outline-none"
              type="button"
            >
              {showCustomProducts ? (
                <ToggleRight className="w-12 h-12 text-green-600" />
              ) : (
                <ToggleLeft className="w-12 h-12 text-gray-400" />
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Current status: <span className={`font-medium ${showCustomProducts ? 'text-green-600' : 'text-gray-600'}`}>
                    {showCustomProducts ? 'Custom products are visible' : 'Custom products are hidden'}
                  </span>
                </p>
              </div>
              <Button
                label={isSaving ? "Saving..." : "Save Changes"}
                onClick={handleSave}
                variant="solid"
                size="md"
                className="text-sm px-6 py-2"
                loading={isSaving}
                icon={isSaving ? Loader2 : Save}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">About Custom Products</h3>
        <p className="text-sm text-blue-800">
          Custom products are created automatically when vendors submit applications for products that don't exist in the marketplace. 
          By default, these products are hidden from public view to maintain marketplace quality. 
          You can enable this setting to allow custom products to be displayed to customers browsing the marketplace.
        </p>
      </section>
    </div>
  );
}

export default MarketplaceSettings;

