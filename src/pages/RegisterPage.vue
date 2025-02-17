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
          Create your account
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div
          v-if="error"
          class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        >
          {{ error }}
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="name" class="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Full name"
              v-model="formData.name"
              @input="handleChange"
            />
          </div>

          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              v-model="formData.email"
              @input="handleChange"
            />
          </div>

          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              v-model="formData.password"
              @input="handleChange"
            />
          </div>

          <div>
            <label for="confirmPassword" class="sr-only"
              >Confirm Password</label
            >
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Confirm password"
              v-model="formData.confirmPassword"
              @input="handleChange"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <UserPlus
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
              />
            </span>
            {{ loading ? "Registering..." : "Register" }}
          </button>
        </div>

        <div class="text-sm text-center">
          <router-link
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { UserPlus } from "lucide-vue-next";
import { authService } from "../services/api";
import { useAuth } from "@/context/AuthContext";

export default {
  name: "RegisterPage",
  components: {
    UserPlus,
  },
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      error: "",
      loading: false,
    };
  },
  setup() {
    const { login } = useAuth();
    return {
      login,
    };
  },
  methods: {
    handleChange() {
      this.error = "";
    },

    validateForm() {
      if (!this.formData.name.trim()) {
        this.error = "Name is required";
        return false;
      }
      if (!this.formData.email.trim()) {
        this.error = "Email is required";
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(this.formData.email)) {
        this.error = "Please enter a valid email address";
        return false;
      }
      if (this.formData.password.length < 6) {
        this.error = "Password must be at least 6 characters long";
        return false;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        this.error = "Passwords do not match";
        return false;
      }
      return true;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.loading = true;
        this.error = "";

        const registrationData = {
          name: this.formData.name,
          email: this.formData.email,
          password: this.formData.password,
        };

        const userData = await authService.register(registrationData);

        this.login(userData);

        if (userData.token) {
          localStorage.setItem("token", userData.token);
        }

        const from = this.$route.query.redirect || "/profile";
        this.$router.replace(from);
      } catch (err) {
        console.error("Registration error:", err);
        if (err.response?.data?.message) {
          this.error = err.response.data.message;
        } else if (err.message) {
          this.error = err.message;
        } else {
          this.error = "Registration failed. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
