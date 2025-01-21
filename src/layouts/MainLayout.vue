<template>
  <div class="min-h-screen bg-gray-50">
    <header class="sticky top-0 bg-white shadow-sm z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-gray-900">Uni-Cart</h1>
          </router-link>

          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                type="text"
                placeholder="Search products..."
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keypress.enter="handleSearch"
                v-model="searchQuery"
              />
              <search-icon
                class="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              />
            </div>
          </div>

          <nav class="flex items-center space-x-8">
            <router-link to="/cart" class="relative">
              <shopping-cart-icon
                class="h-6 w-6 text-gray-600 hover:text-gray-900"
              />
              <span
                class="absolute -top-2 -right-2 bg-blue-600 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {{ cartStore.cartItemCount }}
              </span>
            </router-link>
            <router-link to="/account">
              <user-icon class="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </router-link>
          </nav>
        </div>

        <div class="py-2 border-t">
          <nav class="flex space-x-8">
            <router-link
              v-for="page in pages"
              :key="page"
              :to="'/' + page.toLowerCase()"
              class="text-gray-600 hover:text-gray-900"
            >
              {{ page }}
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About Us</h3>
            <p class="text-gray-400">
              Your trusted source for quality products.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
            <ul class="space-y-2 text-gray-400">
              <li v-for="(link, index) in customerServiceLinks" :key="index">
                <router-link :to="link.path">{{ link.text }}</router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2 text-gray-400">
              <li v-for="(link, index) in quickLinks" :key="index">
                <router-link :to="link.path">{{ link.text }}</router-link>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Newsletter</h3>
            <div class="flex">
              <input
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-4 py-2 rounded-l-lg text-gray-900"
              />
              <button
                class="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  ShoppingCart as ShoppingCartIcon,
  User as UserIcon,
  Search as SearchIcon,
} from "lucide-vue-next";
import { CartContext } from "@/context/CartContext";

export default {
  name: "MainLayout",
  components: {
    ShoppingCartIcon,
    UserIcon,
    SearchIcon,
  },
  setup() {
    const router = useRouter();
    const cartStore = CartContext();
    const searchQuery = ref("");
    const pages = ["Products", "Categories", "About Us", "Contact Us", "More"];

    const customerServiceLinks = [
      { path: "/contact", text: "Contact Us" },
      { path: "/shipping", text: "Shipping Info" },
      { path: "/returns", text: "Returns" },
      { path: "/faq", text: "FAQ" },
    ];

    const quickLinks = [
      { path: "/products", text: "All Products" },
      { path: "/deals", text: "Deals" },
      { path: "/new", text: "New Arrivals" },
      { path: "/trending", text: "Trending" },
    ];

    const handleSearch = () => {
      router.push(`/search?q=${searchQuery.value}`);
    };

    return {
      searchQuery,
      pages,
      customerServiceLinks,
      quickLinks,
      handleSearch,
      cartStore,
    };
  },
};
</script>
