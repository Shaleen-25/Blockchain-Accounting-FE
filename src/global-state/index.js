import create from "zustand";

export const useStore = create((set) => ({
  loggedInUser: localStorage.getItem("loggedInUser") || "",
  setLoggedInUser: (userName) => set({ loggedInUser: userName }),
}));

export default useStore;
