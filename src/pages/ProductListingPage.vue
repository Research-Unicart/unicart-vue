<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">All Products</h1>
      <span class="text-gray-600">
        Showing {{ filteredProducts.length }} products
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside class="lg:col-span-1">
        <ProductFilters
          :categories="categories"
          :priceRange="priceRange"
          @filterChange="handleFilterChange"
          :disabled="loading || !!error"
        />
      </aside>

      <div class="lg:col-span-3">
        <div v-if="loading" class="flex justify-center items-center h-96">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 mb-4">{{ error }}</p>
          <button
            @click="handleRetry"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>

        <div v-else>
          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-500">No products match your filters.</p>
          </div>
          <div v-else>
            <ProductGrid
              :products="currentProducts"
              :loading="loading"
              :error="error"
            />
            <div class="mt-8 flex justify-center">
              <Pagination
                :currentPage="currentPage"
                :totalItems="filteredProducts.length"
                :itemsPerPage="productsPerPage"
                @pageChange="setCurrentPage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import ProductFilters from "../components/Filters/ProductFilters.vue";
import ProductGrid from "../components/Product/ProductGrid.vue";
import Pagination from "../components/Common/Pagination.vue";
import { productService } from "../services/api";

export default {
  name: "ProductListingPage",
  components: {
    ProductFilters,
    ProductGrid,
    Pagination,
  },
  setup() {
    const products = ref([]);
    const filteredProducts = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const currentPage = ref(1);
    const categories = ref([]);
    const priceRange = ref({ min: 0, max: 1000 });
    const productsPerPage = 12;

    const safeJSONParse = (jsonString, fallback = {}) => {
      try {
        return JSON.parse(jsonString);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        return fallback;
      }
    };

    const getProductPriceRange = (product) => {
      if (product.has_variations && product.variations.length > 0) {
        const prices = product.variations.map((v) => parseFloat(v.price));
        return {
          min: Math.min(...prices),
          max: Math.max(...prices),
        };
      }
      return {
        min: parseFloat(product.base_price),
        max: parseFloat(product.base_price),
      };
    };

    const fetchProducts = async () => {
      loading.value = true;
      try {
        const data = await productService.getAllProducts();
        const processedProducts = data.map((product) => ({
          ...product,
          specs: safeJSONParse(product.specs),
          images: safeJSONParse(product.images),
          rating: parseFloat(product.rating),
          base_price: parseFloat(product.base_price),
        }));

        products.value = processedProducts;
        filteredProducts.value = processedProducts;

        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        categories.value = uniqueCategories;

        if (data.length > 0) {
          const allPrices = data.flatMap((product) => {
            const { min, max } = getProductPriceRange(product);
            return [min, max];
          });

          priceRange.value = {
            min: Math.floor(Math.min(...allPrices)),
            max: Math.ceil(Math.max(...allPrices)),
          };
        }

        error.value = null;
      } catch (err) {
        error.value = "Failed to load products. Please try again later.";
        console.error("Error fetching products:", err);
      } finally {
        loading.value = false;
      }
    };

    const handleFilterChange = (filters) => {
      currentPage.value = 1;

      try {
        let filtered = [...products.value];

        if (filters.category !== "all") {
          filtered = filtered.filter(
            (product) =>
              product.category.toLowerCase() === filters.category.toLowerCase()
          );
        }

        filtered = filtered.filter((product) => {
          const { min, max } = getProductPriceRange(product);
          return min <= filters.priceRange[1] && max >= filters.priceRange[0];
        });

        if (filters.rating > 0) {
          filtered = filtered.filter(
            (product) => Math.floor(product.rating) >= filters.rating
          );
        }

        switch (filters.sortBy) {
          case "priceLowToHigh":
            filtered.sort((a, b) => {
              const aPrice = getProductPriceRange(a).min;
              const bPrice = getProductPriceRange(b).min;
              return aPrice - bPrice;
            });
            break;
          case "priceHighToLow":
            filtered.sort((a, b) => {
              const aPrice = getProductPriceRange(a).max;
              const bPrice = getProductPriceRange(b).max;
              return bPrice - aPrice;
            });
            break;
          case "newest":
            filtered.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            break;
          case "popularity":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          default:
            break;
        }

        filteredProducts.value = filtered;
      } catch (err) {
        console.error("Error applying filters:", err);
        error.value = "Error applying filters. Please try again.";
      }
    };

    const currentProducts = computed(() => {
      const indexOfLastProduct = currentPage.value * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      return filteredProducts.value.slice(
        indexOfFirstProduct,
        indexOfLastProduct
      );
    });

    const handleRetry = () => {
      error.value = null;
      currentPage.value = 1;
      window.location.reload();
    };

    onMounted(fetchProducts);

    return {
      products,
      filteredProducts,
      loading,
      error,
      currentPage,
      categories,
      priceRange,
      productsPerPage,
      currentProducts,
      handleFilterChange,
      handleRetry,
    };
  },
};
</script>
