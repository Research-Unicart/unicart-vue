<template>
  <div class="mx-auto py-8 px-4">
    <div v-if="authLoading" class="flex justify-center items-center h-screen">
      Loading...
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4"
    >
      {{ error }}
    </div>

    <template v-else-if="!user">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Welcome</h1>
        <div class="flex space-x-4">
          <button
            @click="$router.push('/login')"
            class="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <LogIn class="w-4 h-4" />
            <span>Login</span>
          </button>
          <button
            @click="$router.push('/register')"
            class="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <UserPlus class="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 class="text-xl mb-4">
          Please login or register to access your profile
        </h2>
        <p class="text-gray-600">
          Create an account to track your orders and manage your profile
          information.
        </p>
      </div>
    </template>

    <template v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">My Account</h1>
        <button
          @click="handleLogout"
          class="flex items-center space-x-2 text-red-600 hover:text-red-800"
        >
          <LogOut class="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <TabGroup>
        <TabList class="grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1 mb-6">
          <Tab as="template" v-slot="{ selected }">
            <button
              :class="[
                'w-full py-2.5 text-sm font-medium leading-5 rounded-lg',
                'focus:outline-none  ',
                selected
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600',
              ]"
            >
              <div class="flex items-center justify-center space-x-2">
                <User class="w-4 h-4" />
                <span>Profile</span>
              </div>
            </button>
          </Tab>
          <Tab as="template" v-slot="{ selected }">
            <button
              :class="[
                'w-full py-2.5 text-sm font-medium leading-5 rounded-lg',
                'focus:outline-none ',
                selected
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600',
              ]"
            >
              <div class="flex items-center justify-center space-x-2">
                <Package class="w-4 h-4" />
                <span>Orders</span>
              </div>
            </button>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Profile Details</h2>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-gray-500">Full Name</label>
                  <p class="font-medium">{{ user?.user?.name }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-500">Email</label>
                  <p class="font-medium">{{ user?.user?.email }}</p>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-xl font-semibold mb-6">Order History</h2>
              <div v-if="orders.length > 0" class="space-y-6">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="border rounded-lg p-4"
                >
                  <div class="flex justify-between items-center mb-4">
                    <div>
                      <h3 class="font-semibold">Order #{{ order.orderId }}</h3>
                      <p class="text-sm text-gray-500">
                        Placed on
                        {{
                          new Date(order.orderCreatedAt).toLocaleDateString()
                        }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold">
                        Rs. {{ calculateOrderTotal(order).toFixed(2) }}
                      </p>
                      <span
                        :class="[
                          'inline-block px-2 py-1 text-sm rounded-full',
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800',
                        ]"
                      >
                        {{ order.status }}
                      </span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div
                      v-for="(item, index) in order.items"
                      :key="index"
                      class="flex justify-between text-sm"
                    >
                      <div class="flex-1">
                        <span class="font-medium">
                          {{
                            products[item?.productId]?.[0]?.name ||
                            "Product not available"
                          }}
                        </span>
                        <span class="ml-2 text-gray-500"
                          >x{{ item.quantity }}</span
                        >
                      </div>
                      <span>
                        Rs. {{ (item.price * item.quantity).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-500 text-center">
                You don't have any orders yet.
              </p>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </template>
  </div>
</template>

<script>
import { ref, computed, watch, inject } from "vue";
import { useRouter } from "vue-router";
import { User, Package, LogOut, LogIn, UserPlus } from "lucide-vue-next";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { orderService, productService } from "../services/api";

export default {
  name: "UserProfile",
  components: {
    User,
    Package,
    LogOut,
    LogIn,
    UserPlus,
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
  },
  setup() {
    const auth = inject("auth");
    const router = useRouter();

    const user = computed(() => auth.user);
    const authLoading = computed(() => auth.loading);

    const orders = ref([]);
    const loading = ref(true);
    const products = ref({});
    const error = ref(null);

    const fetchOrders = async () => {
      if (user.value) {
        try {
          loading.value = true;
          const response = await orderService.getUserOrders(user.value.user.id);
          orders.value = response;
        } catch (err) {
          console.error("Error fetching orders:", err);
          error.value = "Failed to fetch orders";
        } finally {
          loading.value = false;
        }
      }
    };

    const fetchProductDetails = async () => {
      try {
        const productDetailsMap = {};

        const productIds = [
          ...new Set(
            orders.value.flatMap((order) =>
              order.items.map((item) => item.productId)
            )
          ),
        ];

        await Promise.all(
          productIds.map(async (productId) => {
            const productData = await productService.getProductById(productId);
            productDetailsMap[productId] = productData;
          })
        );

        products.value = productDetailsMap;
      } catch (err) {
        console.error("Error fetching product details:", err);
        error.value = "Failed to fetch product details";
      }
    };

    const calculateOrderTotal = (order) => {
      const subtotal = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shipping = order.paymentMethod === "express" ? 20 : 10;
      const tax = subtotal * 0.1;
      return subtotal + shipping + tax;
    };

    const handleLogout = async () => {
      try {
        await auth.logout();
        router.push("/login");
      } catch (err) {
        error.value = "Logout failed";
      }
    };

    watch(
      () => [user.value, authLoading.value],
      () => {
        if (!authLoading.value) {
          fetchOrders();
        }
      },
      { immediate: true }
    );

    watch(
      () => orders.value.length,
      (newLength) => {
        if (newLength > 0) {
          fetchProductDetails();
        }
      }
    );

    return {
      user,
      authLoading,
      orders,
      loading,
      products,
      error,
      calculateOrderTotal,
      handleLogout,
    };
  },
};
</script>
