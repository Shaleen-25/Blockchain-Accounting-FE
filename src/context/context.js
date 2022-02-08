import create from "zustand";

const useStore = create((set) => ({
  loggedInUser: 0,
  successMsg: "",
  setSuccess: (msg) => set({ successMsg: msg }),
  removeSuccess: () => set({ successMsg: "" }),
  errorMsg: "",
  setError: (msg) => set({ errorMsg: msg }),
  removeError: () => set({ errorMsg: "" }),
}));

export default useStore;
