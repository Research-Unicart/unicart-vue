<template>
  <div class="space-y-8">
    <section class="relative h-96 bg-gray-900 rounded-xl overflow-hidden">
      <img
        src="/images/22.jpg"
        alt="Hero"
        class="w-full h-full object-cover opacity-75"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white">
          <h1 class="text-4xl font-bold mb-4">Summer Sale</h1>
          <p class="text-xl mb-6">Up to 50% off on selected items</p>
          <button
            class="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>

    <section>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Featured Products</h2>
        <router-link
          to="/products"
          class="text-blue-600 hover:text-blue-700 flex items-center transition-colors"
        >
          View All <chevron-right-icon class="h-4 w-4 ml-1" />
        </router-link>
      </div>

      <div v-if="error" class="mb-6">
        <p>{{ error }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <template v-if="loading">
          <div v-for="index in 8" :key="index" class="animate-pulse">
            <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </template>
        <product-card
          v-else
          v-for="product in featuredProducts"
          :key="product.id"
          v-bind="product"
        />
      </div>
    </section>

    <section class="bg-gray-100 rounded-xl p-8 text-center">
      <h2 class="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
      <p class="text-gray-600 mb-6">
        Get updates about new products and special offers
      </p>
      <form @submit.prevent="handleSubscribe" class="max-w-md mx-auto">
        <div class="flex">
          <input
            type="email"
            v-model="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-2 rounded-l-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            :disabled="subscribeLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ subscribeLoading ? "Subscribing..." : "Subscribe" }}
          </button>
        </div>
        <p
          v-if="subscribeMessage"
          :class="`mt-2 text-sm ${
            subscribeMessage.type === 'success'
              ? 'text-green-600'
              : 'text-red-600'
          }`"
        >
          {{ subscribeMessage.text }}
        </p>
      </form>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { ChevronRight as ChevronRightIcon } from "lucide-vue-next";
import ProductCard from "../components/Product/ProductCard.vue";
import { productService } from "../services/api";

export default {
  name: "HomePage",
  components: {
    ChevronRightIcon,
    ProductCard,
  },
  setup() {
    const featuredProducts = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const email = ref("");
    const subscribeLoading = ref(false);
    const subscribeMessage = ref(null);

    const safeJSONParse = (jsonString, fallback = {}) => {
      try {
        return JSON.parse(jsonString);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        return fallback;
      }
    };

    const fetchFeaturedProducts = async () => {
      loading.value = true;
      try {
        const data = await productService.getAllProducts();
        const processedProducts = data
          .filter((product) => product)
          .map((product) => ({
            ...product,
            specs: safeJSONParse(product.specs),
            images: safeJSONParse(product.images),
            rating: parseFloat(product.rating),
            base_price: parseFloat(product.base_price),
          }))
          .slice(0, 12);
        featuredProducts.value = processedProducts;
        error.value = null;
      } catch (err) {
        error.value =
          "Failed to load featured products. Please try again later.";
        console.error("Error fetching featured products:", err);
      } finally {
        loading.value = false;
      }
    };

    const handleSubscribe = async () => {
      subscribeLoading.value = true;
      subscribeMessage.value = null;

      try {
        await productService.subscribeNewsletter(email.value);
        subscribeMessage.value = {
          type: "success",
          text: "Successfully subscribed to newsletter!",
        };
        email.value = "";
      } catch (err) {
        subscribeMessage.value = {
          type: "error",
          text: "Failed to subscribe. Please try again.",
        };
        console.error("Error subscribing to newsletter:", err);
      } finally {
        subscribeLoading.value = false;
      }
    };

    onMounted(() => {
      fetchFeaturedProducts();
    });

    return {
      featuredProducts,
      loading,
      error,
      email,
      subscribeLoading,
      subscribeMessage,
      handleSubscribe,
    };
  },
};
</script>
