import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axiosInstance from './axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => ({
     
     isLoggedIn: false,
          token: null,
          login: (token) => set({ isLoggedIn: true, token}),
          logOut: () => set({ isLoggedIn: false, token: null }),

       createCustomers: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post("/admin/create-user", credentials);
          const { data } = response.data;
          set({ isLoggedIn: true, token, loading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || "Authentication failed", loading: false });
        }
      },
   
      }),
    
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => sessionStorage), 
    },
  ),
)
