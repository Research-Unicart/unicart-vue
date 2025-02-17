<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div v-if="cart.length === 0" class="text-center">
      <h1 class="text-2xl font-bold mb-4">Your cart is empty</h1>
      <button
        @click="goBack"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Return to Shopping
      </button>
    </div>

    <template v-else>
      <h1 class="text-2xl font-bold mb-8">Checkout</h1>

      <form
        @submit.prevent="handleSubmit"
        class="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div class="lg:col-span-2 space-y-8">
          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Contact Information</h2>
            <div class="grid grid-cols-2 gap-4">
              <input
                type="text"
                v-model="formData.firstName"
                name="firstName"
                placeholder="First Name"
                required
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                v-model="formData.lastName"
                name="lastName"
                placeholder="Last Name"
                required
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input
              type="email"
              v-model="formData.email"
              name="email"
              placeholder="Email Address"
              required
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="tel"
              v-model="formData.phone"
              name="phone"
              placeholder="Phone Number"
              required
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Shipping Address</h2>
            <input
              type="text"
              v-model="formData.street"
              name="street"
              placeholder="Street Address"
              required
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              v-model="formData.apartment"
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="grid grid-cols-3 gap-4">
              <input
                type="text"
                v-model="formData.city"
                name="city"
                placeholder="City"
                required
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                v-model="formData.state"
                name="state"
                placeholder="State"
                required
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                v-model="formData.zip"
                name="zip"
                placeholder="ZIP Code"
                required
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Shipping Method</h2>
            <div class="space-y-2">
              <label
                class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  v-model="shippingMethod"
                  value="standard"
                  name="shipping"
                  class="mr-4"
                />
                <div class="flex-1">
                  <div class="font-semibold">Standard Shipping</div>
                  <div class="text-sm text-gray-600">4-5 business days</div>
                </div>
                <div class="font-semibold">Rs. 10.00</div>
              </label>

              <label
                class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  v-model="shippingMethod"
                  value="express"
                  name="shipping"
                  class="mr-4"
                />
                <div class="flex-1">
                  <div class="font-semibold">Express Shipping</div>
                  <div class="text-sm text-gray-600">2-3 business days</div>
                </div>
                <div class="font-semibold">Rs. 20.00</div>
              </label>
            </div>
          </div>

          <div class="space-y-4">
            <h2 class="text-xl font-semibold">Payment Method</h2>
            <div class="space-y-4">
              <label
                class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="credit"
                  name="payment"
                  class="mr-4"
                />
                <CreditCard class="w-6 h-6 mr-4" />
                <span class="font-semibold">Credit Card</span>
              </label>

              <label
                class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="cod"
                  name="payment"
                  class="mr-4"
                />
                <Truck class="w-6 h-6 mr-4" />
                <span class="font-semibold">Cash on Delivery</span>
              </label>

              <div v-if="paymentMethod === 'credit'" class="space-y-4">
                <div class="space-y-4 p-4 border rounded-lg">
                  <div>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      required
                      maxlength="19"
                      :class="[
                        'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        errors.cardNumber ? 'border-red-500' : '',
                      ]"
                      @input="formatCardNumber"
                    />
                    <p
                      v-if="errors.cardNumber"
                      class="text-red-500 text-sm mt-1"
                    >
                      {{ errors.cardNumber }}
                    </p>
                  </div>

                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        required
                        maxlength="5"
                        :class="[
                          'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                          errors.expiry ? 'border-red-500' : '',
                        ]"
                        @input="formatExpiry"
                      />
                      <p v-if="errors.expiry" class="text-red-500 text-sm mt-1">
                        {{ errors.expiry }}
                      </p>
                    </div>

                    <div>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        required
                        maxlength="4"
                        :class="[
                          'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                          errors.cvv ? 'border-red-500' : '',
                        ]"
                        @input="formatCVV"
                      />
                      <p v-if="errors.cvv" class="text-red-500 text-sm mt-1">
                        {{ errors.cvv }}
                      </p>
                    </div>

                    <div>
                      <input
                        type="text"
                        name="cardholderName"
                        placeholder="Name on Card"
                        required
                        :class="[
                          'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                          errors.cardholderName ? 'border-red-500' : '',
                        ]"
                      />
                      <p
                        v-if="errors.cardholderName"
                        class="text-red-500 text-sm mt-1"
                      >
                        {{ errors.cardholderName }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="paymentMethod === 'cod'"
                class="p-4 border rounded-lg bg-gray-50"
              >
                <div class="flex items-start space-x-2">
                  <div class="text-sm text-gray-600">
                    <p class="font-semibold mb-2">Cash on Delivery Terms:</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Payment will be collected at the time of delivery</li>
                      <li>Please keep exact change ready if possible</li>
                      <li>Cash and UPI payments accepted</li>
                      <li>Additional fee of Rs. 50 applies for COD orders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="border rounded-lg p-6 space-y-6 sticky top-28">
            <h2 class="text-xl font-semibold">Order Summary</h2>

            <div class="space-y-4">
              <div v-for="item in cart" :key="item.id" class="flex space-x-4">
                <div class="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    :src="item.images[0]"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold">{{ item.name }}</h3>
                  <div class="text-sm text-gray-600">
                    Quantity: {{ item.quantity }}
                    <span v-if="item.size"> | Size: {{ item.size }}</span>
                  </div>
                  <div class="font-semibold">Rs. {{ item.price }}</div>
                </div>
              </div>
            </div>

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
              <div
                v-if="paymentMethod === 'cod'"
                class="flex justify-between text-gray-600"
              >
                <span>COD Fee</span>
                <span>Rs. 50.00</span>
              </div>
              <div class="h-px bg-gray-200 my-2" />
              <div class="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs. {{ orderTotal.toFixed(2) }}</span>
              </div>
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <ShoppingBag class="w-5 h-5" />
              <span>Place Order</span>
            </button>

            <p class="text-sm text-gray-600 text-center">
              {{
                paymentMethod === "credit"
                  ? "Your payment information is encrypted and secure"
                  : "Payment will be collected upon delivery"
              }}
            </p>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { CreditCard, ShoppingBag, Truck } from "lucide-vue-next";
import { CartContext } from "@/context/CartContext";
import { orderService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const router = useRouter();
const cartStore = CartContext();
const isLoading = ref(false);
const { user } = useAuth();

const shippingMethod = ref("standard");
const paymentMethod = ref("credit");
const errors = ref({});
const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
});

const cart = computed(() => cartStore.cart);
const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
const shipping = computed(() => (shippingMethod.value === "express" ? 20 : 10));
const tax = computed(() => subtotal.value * 0.1);
const orderTotal = computed(
  () =>
    subtotal.value +
    shipping.value +
    tax.value +
    (paymentMethod.value === "cod" ? 50 : 0)
);

const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/(\d{4})/g, "$1 ").trim();
  e.target.value = value;
};

const formatExpiry = (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }
  e.target.value = value;
};

const formatCVV = (e) => {
  e.target.value = e.target.value.replace(/\D/g, "");
};

const validateCard = (cardNumber, expiry, cvv, cardholderName) => {
  const errors = {};

  const isValidLuhn = (number) => {
    const digits = number.replace(/\D/g, "");
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
    errors.cardNumber = "Please enter a valid 16-digit card number";
  } else if (!isValidLuhn(cardNumber)) {
    errors.cardNumber = "Invalid card number";
  }

  const currentDate = new Date();
  const [expMonth, expYear] = expiry
    .split("/")
    .map((num) => parseInt(num.trim()));
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    errors.expiry = "Use MM/YY format";
  } else if (expMonth < 1 || expMonth > 12) {
    errors.expiry = "Invalid month";
  } else if (
    expYear < currentYear ||
    (expYear === currentYear && expMonth < currentMonth)
  ) {
    errors.expiry = "Card has expired";
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    errors.cvv = "CVV must be 3 or 4 digits";
  }

  if (!cardholderName.trim()) {
    errors.cardholderName = "Name on card is required";
  } else if (cardholderName.trim().length < 2) {
    errors.cardholderName = "Please enter a valid name";
  }

  return errors;
};

const handleSubmit = async (e) => {
  if (paymentMethod.value === "credit") {
    const cardNumber = e.target.cardNumber.value;
    const expiry = e.target.expiry.value;
    const cvv = e.target.cvv.value;
    const cardholderName = e.target.cardholderName.value;

    const cardErrors = validateCard(cardNumber, expiry, cvv, cardholderName);
    if (Object.keys(cardErrors).length > 0) {
      errors.value = cardErrors;
      const firstErrorField = document.querySelector(
        `[name="${Object.keys(cardErrors)[0]}"]`
      );
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }

  errors.value = {};
  isLoading.value = true;
  errors.value = {};

  try {
    const orderDetails = {
      cart: cart.value,
      subtotal: subtotal.value,
      shipping: shipping.value,
      tax: tax.value,
      total: orderTotal.value,
      email: formData.value.email,
      shippingAddress: {
        street: formData.value.street,
        apartment: formData.value.apartment,
        city: formData.value.city,
        state: formData.value.state,
        zip: formData.value.zip,
      },
      shippingMethod: shippingMethod.value,
      customerInfo: {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        phone: formData.value.phone,
      },
    };

    localStorage.setItem("lastOrder", JSON.stringify(orderDetails));

    const orderData = {
      userId: user?.user?.id,
      cart: cart.value.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        variationId: item.variation ? item.variation.id : null,
      })),
      paymentMethod: paymentMethod.value,
      status: "Pending",
      shippingAddress: orderDetails.shippingAddress,
      customerInfo: orderDetails.customerInfo,
    };
    await orderService.createOrder(orderData);

    cartStore.clearCart();
    router.push("/thank-you");
  } catch (error) {
    console.error("Order placement error:", error);
    errors.value.submit =
      error.response?.data?.message ||
      "An error occurred while placing your order";
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => window.history.back();
</script>
