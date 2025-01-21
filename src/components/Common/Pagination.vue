<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center space-x-2">
    <button
      @click="$emit('page-change', currentPage - 1)"
      :disabled="currentPage === 1"
      :class="[
        'p-2 rounded-lg border',
        currentPage === 1
          ? 'text-gray-400 border-gray-200 cursor-not-allowed'
          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
      ]"
      aria-label="Previous page"
    >
      <ChevronLeft class="h-5 w-5" />
    </button>

    <template v-if="getPageNumbers[0] > 1">
      <button
        @click="$emit('page-change', 1)"
        :class="[
          'px-4 py-2 rounded-lg border',
          currentPage === 1
            ? 'bg-blue-50 text-blue-600 border-blue-200'
            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
        ]"
      >
        1
      </button>
      <span v-if="getPageNumbers[0] > 2" class="px-2 text-gray-500">...</span>
    </template>

    <button
      v-for="page in getPageNumbers"
      :key="page"
      @click="$emit('page-change', page)"
      :class="[
        'px-4 py-2 rounded-lg border',
        currentPage === page
          ? 'bg-blue-50 text-blue-600 border-blue-200'
          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
      ]"
    >
      {{ page }}
    </button>

    <template v-if="getPageNumbers[getPageNumbers.length - 1] < totalPages">
      <span
        v-if="getPageNumbers[getPageNumbers.length - 1] < totalPages - 1"
        class="px-2 text-gray-500"
      >...</span>
      <button
        @click="$emit('page-change', totalPages)"
        :class="[
          'px-4 py-2 rounded-lg border',
          currentPage === totalPages
            ? 'bg-blue-50 text-blue-600 border-blue-200'
            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
        ]"
      >
        {{ totalPages }}
      </button>
    </template>

    <button
      @click="$emit('page-change', currentPage + 1)"
      :disabled="currentPage === totalPages"
      :class="[
        'p-2 rounded-lg border',
        currentPage === totalPages
          ? 'text-gray-400 border-gray-200 cursor-not-allowed'
          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
      ]"
      aria-label="Next page"
    >
      <ChevronRight class="h-5 w-5" />
    </button>
  </nav>
</template>

<script>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

export default {
  name: 'PaginationComponent',
  components: {
    ChevronLeft,
    ChevronRight
  },
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    getPageNumbers() {
      const pages = []
      const showPages = 5

      let startPage = Math.max(1, this.currentPage - Math.floor(showPages / 2))
      let endPage = Math.min(this.totalPages, startPage + showPages - 1)

      if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(1, endPage - showPages + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      return pages
    }
  }
}
</script>