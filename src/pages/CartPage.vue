<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8">Shopping Cart</h1>

    <div v-if="cart.length === 0" class="text-center py-12">
      <p class="text-gray-600 mb-4">Your cart is empty</p>
      <button
        @click="continueShopping"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Continue Shopping
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div
          v-if="hasStockWarnings"
          class="flex items-center bg-amber-50 text-amber-600 p-4 rounded-lg mb-4"
        >
          <AlertCircle class="w-5 h-5 mr-2" />
          <span>Some items in your cart have reached their stock limit</span>
        </div>

        <div
          v-for="item in cart"
          :key="itemKey(item)"
          class="flex space-x-4 border rounded-lg p-4"
        >
          <div class="w-24 h-24 rounded-lg overflow-hidden">
            <img
              :src="item.images[0]"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 space-y-2">
            <div class="flex justify-between">
              <h3 class="font-semibold">{{ item.name }}</h3>
              <button
                @click="handleRemoveFromCart(item)"
                class="text-red-600 hover:text-red-700"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>

            <div v-if="item.variation" class="text-gray-600">
              Variation: {{ item.variation.variation }}
            </div>

            <div class="flex justify-between items-center">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <button
                    @click="handleUpdateQuantity(item, -1)"
                    :disabled="item.quantity <= 1"
                    class="p-1 rounded-md border hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <Minus class="w-4 h-4" />
                  </button>
                  <span class="w-8 text-center">{{ item.quantity }}</span>
                  <button
                    @click="handleUpdateQuantity(item, 1)"
                    :disabled="isAtStockLimit(item)"
                    class="p-1 rounded-md border hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="isAtStockLimit(item)" class="text-sm text-amber-600">
                  Max quantity reached
                </div>
                <div class="text-sm text-gray-500">
                  {{ getAvailableStock(item) - item.quantity }} units available
                </div>
              </div>
              <div class="font-semibold">
                Rs. {{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="border rounded-lg p-6 space-y-4 sticky top-4">
          <h2 class="text-xl font-bold">Order Summary</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span>Rs. {{ shipping.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax</span>
              <span>Rs. {{ tax.toFixed(2) }}</span>
            </div>
            <div class="h-px bg-gray-200 my-2" />
            <div class="flex justify-between font-bold">
              <span>Total</span>
              <span>Rs. {{ total.toFixed(2) }}</span>
            </div>
          </div>

          <button
            @click="proceedToCheckout"
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { Trash2, Plus, Minus, AlertCircle } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useCart } from "../context/CartContext";

export default defineComponent({
  name: "CartPage",
  components: {
    Trash2,
    Plus,
    Minus,
    AlertCircle,
  },
  setup() {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const getAvailableStock = (item) => {
      return item.variation ? item.variation.stock : item.base_stock;
    };

    const isAtStockLimit = (item) => {
      const availableStock = getAvailableStock(item);
      return item.quantity >= availableStock;
    };

    const handleUpdateQuantity = (item, change) => {
      const availableStock = getAvailableStock(item);
      const newQuantity = item.quantity + change;

      if (newQuantity <= 0 || newQuantity > availableStock) return;

      const updatedItem = {
        ...item,
        quantity: newQuantity,
      };

      updateQuantity(item.id, newQuantity, item.variation);
      cart.splice(cart.indexOf(item), 1, updatedItem);
    };

    const handleRemoveFromCart = (item) => {
      removeFromCart(item.id, item.variation);
    };

    const subtotal = computed(() => getCartTotal());
    const shipping = 10;
    const tax = computed(() => subtotal.value * 0.1);
    const total = computed(() => subtotal.value + shipping + tax.value);

    const hasStockWarnings = computed(() =>
      cart.some((item) => isAtStockLimit(item))
    );

    const continueShopping = () => {
      router.push("/");
    };

    const proceedToCheckout = () => {
      router.push("/checkout");
    };

    const itemKey = (item) =>
      `${item.id}-${item.variation ? item.variation.id : "base"}`;

    return {
      cart,
      getAvailableStock,
      isAtStockLimit,
      handleUpdateQuantity,
      handleRemoveFromCart,
      subtotal,
      shipping,
      tax,
      total,
      hasStockWarnings,
      continueShopping,
      proceedToCheckout,
      itemKey,
    };
  },
});
</script>

<style scoped></style>
