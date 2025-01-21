<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-8">
      <div
        class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
      >
        <CheckCircle class="w-8 h-8 text-green-600" />
      </div>
      <h1 class="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
      <p class="text-gray-600 mb-4">
        Order #{{ orderNumber }} has been successfully placed
      </p>
      <p class="text-gray-600">
        A confirmation email has been sent to {{ orderDetails.email }}
      </p>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
      <div class="space-y-4">
        <div
          v-for="item in orderDetails.cart"
          :key="item.id"
          class="flex items-center space-x-4"
        >
          <img
            :src="item.images[0]"
            :alt="item.name"
            class="w-16 h-16 object-cover rounded"
          />
          <div class="flex-1">
            <h3 class="font-semibold">{{ item.name }}</h3>
            <p class="text-gray-600">
              Quantity: {{ item.quantity }}
              <span v-if="item.size"> | Size: {{ item.size }}</span>
            </p>
          </div>
          <p class="font-semibold">
            Rs. {{ (item.price * item.quantity).toFixed(2) }}
          </p>
        </div>

        <div class="border-t pt-4 mt-4">
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Subtotal</span>
            <span>Rs. {{ orderDetails.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Shipping</span>
            <span>Rs. {{ orderDetails.shipping.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Tax</span>
            <span>Rs. {{ orderDetails.tax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rs. {{ orderDetails.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Shipping Details</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold mb-2">Delivery Address</h3>
          <p class="text-gray-600">
            {{ orderDetails.shippingAddress.street }}<br />
            {{ orderDetails.shippingAddress.city }},
            {{ orderDetails.shippingAddress.state }}
            {{ orderDetails.shippingAddress.zip }}
          </p>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Shipping Method</h3>
          <p class="text-gray-600">
            {{
              orderDetails.shippingMethod === "express"
                ? "Express Shipping (2-3 business days)"
                : "Standard Shipping (4-5 business days)"
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-between">
      <button
        @click="continueShopping"
        class="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Continue Shopping</span>
      </button>
      <button
        @click="printOrder"
        class="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
      >
        <Printer class="w-4 h-4" />
        <span>Print Order</span>
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { CheckCircle, Printer, ArrowLeft } from "lucide-vue-next";

export default defineComponent({
  name: "ThankYouPage",
  components: {
    CheckCircle,
    Printer,
    ArrowLeft,
  },
  data() {
    return {
      orderDetails: JSON.parse(localStorage.getItem("lastOrder") || "{}"),
      orderNumber: Math.random().toString(36).substring(2, 12).toUpperCase(),
    };
  },
  methods: {
    continueShopping() {
      this.$router.push("/products");
    },
    printOrder() {
      window.print();
    },
  },
});
</script>

<style scoped></style>
