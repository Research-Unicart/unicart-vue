<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="loading" class="animate-pulse space-y-8">
      <div class="aspect-square bg-gray-200 rounded-lg w-full" />
      <div class="space-y-4">
        <div class="h-8 bg-gray-200 rounded w-3/4" />
        <div class="h-6 bg-gray-200 rounded w-1/2" />
      </div>
    </div>

    <div v-else-if="error || !product" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-600 text-center">{{ error || "Product not found" }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <div class="aspect-square rounded-lg overflow-hidden">
          <img
            :src="product.images[selectedImageIndex]"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-if="product.images.length > 1" class="grid grid-cols-4 gap-4">
          <button
            v-for="(image, idx) in product.images"
            :key="idx"
            @click="selectedImageIndex = idx"
            :class="[
              'aspect-square rounded-lg overflow-hidden border-2',
              selectedImageIndex === idx
                ? 'border-blue-600'
                : 'border-gray-200',
            ]"
          >
            <img
              :src="image"
              :alt="`${product.name} view ${idx + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold">{{ product.name }}</h1>
          <div class="flex items-center mt-2 space-x-4">
            <div class="flex items-center">
              <Star
                v-for="idx in 5"
                :key="idx"
                :class="[
                  'w-5 h-5',
                  idx <= Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300',
                ]"
              />
              <span class="ml-2 text-gray-600">({{ product.rating }})</span>
            </div>
            <span class="text-gray-600">{{ product.category }}</span>
          </div>
        </div>

        <div class="flex items-baseline space-x-2">
          <span class="text-3xl font-bold"
            >Rs. {{ getCurrentPrice.toFixed(2) }}</span
          >
          <span v-if="getCurrentStock > 0" class="text-sm text-gray-600">
            {{ getCurrentStock }} units available
          </span>
        </div>

        <div v-if="product.variations?.length > 0" class="space-y-2">
          <h3 class="font-semibold">Storage Options</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="variation in product.variations"
              :key="variation.id"
              @click="handleVariationChange(variation)"
              :class="[
                'px-4 py-2 rounded-lg border',
                selectedVariation?.id === variation.id
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 hover:border-gray-400',
              ]"
            >
              {{ variation.variation }}
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <h3 class="font-semibold">Quantity</h3>
          <div class="flex items-center space-x-4">
            <button
              @click="handleQuantityChange(quantity - 1)"
              class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              :disabled="quantity <= 1"
            >
              -
            </button>
            <span class="w-12 text-center font-medium">{{ quantity }}</span>
            <button
              @click="handleQuantityChange(quantity + 1)"
              class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              :disabled="quantity >= getCurrentStock"
            >
              +
            </button>
          </div>
        </div>

        <div class="flex space-x-4">
          <button
            @click="handleAddToCart"
            class="flex-1 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            :disabled="isOutOfStock"
          >
            <ShoppingCart class="w-5 h-5" />
            <span>{{ isOutOfStock ? "Out of Stock" : "Add to Cart" }}</span>
          </button>
          <button
            @click="$router.push('/cart')"
            class="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            View Cart
          </button>
        </div>

        <div class="space-y-2">
          <h3 class="font-semibold">Product Specifications</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="[key, value] in Object.entries(product.specs)"
              :key="key"
              class="flex flex-col"
            >
              <dt class="text-gray-600">{{ key }}</dt>
              <dd class="font-medium">{{ value }}</dd>
            </div>
          </dl>
        </div>

        <div v-if="product.description" class="space-y-2">
          <h3 class="font-semibold">Description</h3>
          <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { Star, ShoppingCart } from "lucide-vue-next";
import { productService } from "../services/api";
import { CartContext } from "@/context/CartContext";

export default {
  name: "SingleProductPage",
  components: {
    Star,
    ShoppingCart,
  },
  setup() {
    const route = useRoute();
    const cartStore = CartContext();

    const quantity = ref(1);
    const product = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const selectedVariation = ref(null);
    const selectedImageIndex = ref(0);

    const currentCartItem = computed(() => {
      if (!product.value) return null;
      return cartStore.cart.find(
        (item) =>
          item.id === product.value.id &&
          (product.value.has_variations
            ? item.variationId === selectedVariation.value?.id
            : true)
      );
    });

    const getCurrentPrice = computed(() => {
      if (!product.value) return 0;
      const price = selectedVariation.value?.price || product.value.base_price;
      return parseFloat(price) || 0;
    });

    const getCurrentStock = computed(() => {
      if (!product.value) return 0;
      return selectedVariation.value?.stock ?? product.value.base_stock ?? 0;
    });

    const isOutOfStock = computed(() => getCurrentStock.value <= 0);

    const fetchProduct = async () => {
      loading.value = true;
      try {
        const data = await productService.getProductById(route.params.id);
        if (!data || !data[0]) throw new Error("Product not found");

        const productData = data[0];

        const specs =
          typeof productData.specs === "string"
            ? JSON.parse(productData.specs)
            : productData.specs;
        const images =
          typeof productData.images === "string"
            ? JSON.parse(productData.images)
            : productData.images;

        const processedData = {
          ...productData,
          specs,
          images,
          rating: parseFloat(productData.rating) || 0,
          base_price: parseFloat(productData.base_price) || 0,
          variations: productData.variations?.map((variation) => ({
            ...variation,
            price: parseFloat(variation.price) || 0,
          })),
        };

        product.value = processedData;

        if (processedData.variations?.length > 0) {
          selectedVariation.value = {
            ...processedData.variations[0],
            price: parseFloat(processedData.variations[0].price) || 0,
          };
        }
      } catch (err) {
        error.value = err.message || "Error loading product details";
        console.error("Error:", err);
      } finally {
        loading.value = false;
      }
    };

    const handleQuantityChange = (newQuantity) => {
      if (!product.value || isOutOfStock.value) return;
      const maxStock = getCurrentStock.value;
      const updatedQuantity = Math.max(1, Math.min(newQuantity, maxStock));
      quantity.value = updatedQuantity;

      if (currentCartItem.value) {
        cartStore.updateQuantity(
          product.value.id,
          updatedQuantity,
          selectedVariation.value?.id || null
        );
      }
    };

    const handleAddToCart = () => {
      if (!product.value || isOutOfStock.value) return;
      if (!currentCartItem.value) {
        cartStore.addToCart(
          product.value,
          quantity.value,
          selectedVariation.value?.id || null
        );
      } else {
        cartStore.updateQuantity(
          product.value.id,
          quantity.value,
          selectedVariation.value?.id || null
        );
      }
    };

    const handleVariationChange = (variation) => {
      selectedVariation.value = {
        ...variation,
        price: parseFloat(variation.price) || 0,
      };
    };

    watch(currentCartItem, () => {
      if (!product.value) return;
      quantity.value = currentCartItem.value?.quantity || 1;
    });

    onMounted(fetchProduct);

    return {
      product,
      loading,
      error,
      quantity,
      selectedVariation,
      selectedImageIndex,
      currentCartItem,
      getCurrentPrice,
      getCurrentStock,
      isOutOfStock,
      handleQuantityChange,
      handleAddToCart,
      handleVariationChange,
    };
  },
};
</script>
