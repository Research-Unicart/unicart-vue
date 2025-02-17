<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <router-link to="/" class="flex justify-center">
        <h1 class="text-2xl font-bold text-gray-900">Uni-Cart</h1>
      </router-link>
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link
            to="/register"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        >
          {{ error }}
        </div>
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-600 focus:z-10 sm:text-sm"
              placeholder="Email address"
              v-model="formData.email"
              :disabled="isLoading"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-600 focus:z-10 sm:text-sm"
              placeholder="Password"
              v-model="formData.password"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogIn class="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
            </span>
            {{ isLoading ? "Signing in..." : "Sign in" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { LogIn } from "lucide-vue-next";
import { authService } from "../services/api";
import { useAuth } from "@/context/AuthContext";

export default {
  name: "LoginPage",
  components: {
    LogIn,
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      error: "",
      isLoading: false,
    };
  },
  setup() {
    const { login } = useAuth();
    return {
      login,
    };
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      this.error = "";

      try {
        const userData = await authService.login(this.formData);
        this.login(userData);
        const from = this.$route.query.redirect || "/profile";
        this.$router.replace(from);
      } catch (err) {
        console.error("Login error:", err);
        this.error =
          err.response?.data?.error || "Invalid credentials. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
