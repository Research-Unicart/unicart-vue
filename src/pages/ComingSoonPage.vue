<template>
  <div
    class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
  >
    <div class="space-y-6 max-w-lg">
      <div class="relative w-24 h-24 mx-auto mb-8">
        <div
          class="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"
        ></div>
        <div class="relative bg-blue-500 rounded-full p-6">
          <svg
            class="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </div>

      <h1 class="text-4xl font-bold text-gray-900">Coming Soon</h1>
      <p class="text-xl text-gray-600">
        Our {{ pageName }} page is under construction. We're working hard to
        bring you something amazing!
      </p>

      <div class="pt-8">
        <button
          @click="navigateToHome"
          class="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft class="w-5 h-5 mr-2" />
          Back to Home
        </button>
      </div>
    </div>

    <div class="mt-16 space-y-4">
      <p class="text-sm text-gray-500">Want to know when we launch?</p>
      <form @submit.prevent="handleSubscribe" class="flex gap-4 justify-center">
        <input
          type="email"
          v-model="email"
          placeholder="Enter your email"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
        <button
          type="submit"
          class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Notify Me
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ArrowLeft } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";

const email = ref("");
const route = useRoute();
const router = useRouter();

const pageName = computed(() => {
  const currentPath = route.path.split("/")[1];
  return currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
});

const handleSubscribe = () => {
  if (email.value) {
    alert("Thank you for subscribing! We will notify you when we launch.");
    email.value = "";
  }
};

const navigateToHome = () => {
  router.push("/");
};
</script>
