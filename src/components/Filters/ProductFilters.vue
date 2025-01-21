<template>
  <div class="space-y-6 p-4 bg-white rounded-lg shadow">
    <div>
      <h3 class="text-lg font-semibold mb-3">Sort By</h3>
      <select
        v-model="filters.sortBy"
        @change="emitFilterChange"
        class="w-full p-2 border rounded-lg"
      >
        <option value="popularity">Popularity</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
        <option value="newest">Newest First</option>
      </select>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">Categories</h3>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="radio"
            name="category"
            value="all"
            v-model="filters.category"
            @change="emitFilterChange"
            class="mr-2"
          />
          All Categories
        </label>
        <label
          v-for="category in categories"
          :key="category"
          class="flex items-center"
        >
          <input
            type="radio"
            :value="category"
            v-model="filters.category"
            @change="emitFilterChange"
            class="mr-2"
          />
          {{ category }}
        </label>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">Rating</h3>
      <div class="space-y-2">
        <label
          v-for="rating in ratings"
          :key="rating"
          class="flex items-center"
        >
          <input
            type="radio"
            :value="rating"
            v-model="filters.rating"
            @change="emitFilterChange"
            class="mr-2"
          />
          <span v-if="rating === 0">All Ratings</span>
          <span v-else class="flex items-center">
            <span
              v-for="i in 5"
              :key="i"
              :class="[
                'text-sm',
                i <= rating ? 'text-yellow-400' : 'text-gray-300',
              ]"
            >
              ★
            </span>
            <span class="ml-2">& up</span>
          </span>
        </label>
      </div>
    </div>

    <button
      @click="clearFilters"
      class="w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
    >
      Clear All Filters
    </button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
    priceRange: {
      type: Object,
      required: true,
    },
  },
  emits: ["filterChange"],
  setup(props, { emit }) {
    const filters = ref({
      category: "all",
      priceRange: [props.priceRange.min, props.priceRange.max],
      rating: 0,
      sortBy: "popularity",
    });

    const ratings = [0, 4, 3, 2, 1];

    const emitFilterChange = () => {
      emit("filterChange", { ...filters.value });
    };

    const clearFilters = () => {
      filters.value = {
        category: "all",
        priceRange: [props.priceRange.min, props.priceRange.max],
        rating: 0,
        sortBy: "popularity",
      };
      emitFilterChange();
    };

    return {
      filters,
      ratings,
      emitFilterChange,
      clearFilters,
    };
  },
};
</script>
