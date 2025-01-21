<template>
  <div
    v-if="loading"
    class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6"
  >
    <div
      v-for="index in 8"
      :key="index"
      class="bg-white rounded-lg shadow-md p-4 animate-pulse"
    >
      <div class="h-48 bg-gray-200 rounded mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>

  <div v-else-if="error" class="text-center py-8">
    <p class="text-red-500">{{ error }}</p>
    <button
      @click="() => window.location.reload()"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Retry
    </button>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :id="product.id"
      :name="product.name"
      :base_price="product.base_price"
      :images="product.images"
      :category="product.category"
      :rating="product.rating"
      :base_stock="product.base_stock"
      :has_variations="product.has_variations"
      :variations="product.variations"
      :specs="product.specs"
      :description="product.description"
    />
  </div>
</template>

<script>
import ProductCard from "./ProductCard.vue";

export default {
  name: "ProductGrid",
  components: {
    ProductCard,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
};
</script>
