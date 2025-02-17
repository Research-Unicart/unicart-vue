import { reactive, readonly } from "vue";

const state = reactive({
  user: null,
  loading: true,
});

const login = (userData) => {
  state.user = userData;
  localStorage.setItem("user", JSON.stringify(userData));
};

const logout = () => {
  state.user = null;
  localStorage.removeItem("user");
};

const initializeAuth = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    state.user = JSON.parse(storedUser);
  }
  state.loading = false;
};

initializeAuth();

export const useAuth = () => ({
  user: readonly(state.user),
  loading: readonly(state.loading),
  login,
  logout,
});
