<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between h-full cursor-pointer"
    @click="handleCardClick"
  >
    <div v-if="loading" class="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div class="h-48 bg-gray-200 rounded mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>

    <div v-else-if="error" class="bg-white rounded-lg shadow-md p-4">
      <p class="text-red-500 text-center">{{ error }}</p>
    </div>

    <template v-else>
      <div class="relative">
        <img :src="displayImage" :alt="name" class="w-full h-48 object-cover" />
        <div
          v-if="isOutOfStock"
          class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm"
        >
          Out of Stock
        </div>
        <button
          class="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100"
          @click.stop
          aria-label="Add to wishlist"
        >
          <heart-icon class="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div class="p-4 flex-1">
        <div class="text-sm text-gray-500 mb-1">{{ category }}</div>
        <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ name }}</h3>

        <div class="flex items-center mb-2">
          <span
            v-for="n in 5"
            :key="n"
            :class="`text-sm ${
              n <= numericRating ? 'text-yellow-400' : 'text-gray-300'
            }`"
          >
            ★
          </span>
          <span class="text-sm text-gray-500 ml-1">({{ numericRating }})</span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">
            {{
              priceRange.min === priceRange.max
                ? `Rs. ${priceRange.min}`
                : `Rs. ${priceRange.min} - ${priceRange.max}`
            }}
          </span>
        </div>
      </div>

      <div class="flex justify-center m-4">
        <button
          @click.stop="handleShopNow"
          :disabled="isOutOfStock"
          :class="`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isOutOfStock
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`"
        >
          <shopping-cart-icon class="h-4 w-4" />
          {{ shopNowButtonText }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Heart as HeartIcon,
  ShoppingCart as ShoppingCartIcon,
} from "lucide-vue-next";
import { productService } from "../../services/api";
import { CartContext } from "@/context/CartContext";

export default {
  name: "ProductCard",
  components: {
    HeartIcon,
    ShoppingCartIcon,
  },
  props: {
    id: { required: true },
    name: { required: true },
    base_price: { required: true },
    images: { required: true },
    category: { required: true },
    rating: { required: true },
    base_stock: { required: true },
    has_variations: { default: false },
    variations: { default: () => [] },
    specs: { required: true },
    description: { required: true },
  },
  setup(props) {
    const router = useRouter();
    const cartStore = CartContext();
    const loading = ref(false);
    const error = ref(null);
    const productData = ref(null);

    const parsedImages = computed(() => {
      return typeof props.images === "string"
        ? JSON.parse(props.images)
        : props.images;
    });

    const displayImage = computed(() => {
      return parsedImages.value?.[0] || "/placeholder-image.jpg";
    });

    const numericRating = computed(() => {
      return parseFloat(props.rating);
    });

    const priceRange = computed(() => {
      if (props.has_variations && props.variations.length > 0) {
        return {
          min: Math.min(...props.variations.map((v) => parseFloat(v.price))),
          max: Math.max(...props.variations.map((v) => parseFloat(v.price))),
        };
      }
      return {
        min: parseFloat(props.base_price),
        max: parseFloat(props.base_price),
      };
    });

    const checkStock = (product) => {
      if (product.has_variations) {
        return product.variations.every((v) => v.stock <= 0);
      }
      return product.base_stock <= 0;
    };

    const isOutOfStock = computed(() => {
      return productData.value
        ? checkStock(productData.value)
        : checkStock({
            has_variations: props.has_variations,
            variations: props.variations,
            base_stock: props.base_stock,
          });
    });

    const shopNowButtonText = computed(() => {
      if (isOutOfStock.value) return "Out of Stock";
      return props.has_variations ? "View Options" : "Shop Now";
    });

    const handleAddToCart = async () => {
      if (!props.has_variations) {
        try {
          const freshProductData = await productService.getProductById(
            props.id
          );
          cartStore.addToCart(freshProductData[0], 1);
          return true;
        } catch (err) {
          error.value = "Error adding to cart";
          console.error("Error:", err);
          return false;
        }
      }
      return false;
    };

    const handleShopNow = async () => {
      if (isOutOfStock.value) {
        return;
      }

      if (props.has_variations) {
        router.push(`/single-product/${props.id}`);
      } else {
        const success = await handleAddToCart();
        if (success) {
          router.push("/cart");
        }
      }
    };

    const handleCardClick = () => {
      router.push(`/single-product/${props.id}`);
    };

    const fetchProductDetails = async () => {
      loading.value = true;
      try {
        const data = await productService.getProductById(props.id);
        productData.value = data;
        error.value = null;
      } catch (err) {
        error.value = "Error loading product details";
        console.error("Error:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchProductDetails();
    });

    return {
      loading,
      error,
      displayImage,
      numericRating,
      priceRange,
      isOutOfStock,
      shopNowButtonText,
      handleShopNow,
      handleCardClick,
    };
  },
};
</script>
