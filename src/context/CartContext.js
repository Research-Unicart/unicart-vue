import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const CartContext = defineStore('CartContext', () => {
  const state = ref({
    items: JSON.parse(localStorage.getItem("cart")) || [],
  })

  function cartReducer(state, action) {
    switch (action.type) {
      case "ADD_TO_CART": {
        const existingItemIndex = state.items.findIndex(
          (item) =>
            item.id === action.payload.id &&
            item.variation?.variation === action.payload.variation?.variation
        )

        if (existingItemIndex > -1) {
          const newItems = [...state.items]
          const newQuantity =
            newItems[existingItemIndex].quantity + action.payload.quantity

          const stockLimit = action.payload.variation
            ? action.payload.variation.stock
            : action.payload.base_stock

          if (newQuantity <= stockLimit) {
            newItems[existingItemIndex].quantity = newQuantity
            return { ...state, items: newItems }
          }
          return state
        }
          return { ...state, items: [...state.items, action.payload] }
        }

      case "REMOVE_FROM_CART":
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item.id === action.payload.id &&
                item.variation?.variation === action.payload.variation?.variation
              )
          ),
        }

      case "UPDATE_QUANTITY":
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id &&
            item.variation?.variation === action.payload.variation?.variation
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        }

      case "CLEAR_CART":
        return { ...state, items: [] }

      default:
        return state
    }
  }

  watch(
    () => state.value.items,
    (items) => {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  )

  const addToCart = (product, quantity = 1, variationId = null) => {
    try {
      const specs =
        typeof product.specs === "string"
          ? JSON.parse(product.specs)
          : product.specs
      const images =
        typeof product.images === "string"
          ? JSON.parse(product.images)
          : product.images

      const selectedVariation = variationId
        ? product.variations.find((v) => v.id === variationId)
        : null

      const price = selectedVariation
        ? parseFloat(selectedVariation.price)
        : parseFloat(product.base_price)

      const availableStock = selectedVariation
        ? selectedVariation.stock
        : product.base_stock

      if (quantity > availableStock) {
        console.warn("Requested quantity exceeds available stock")
        return
      }

      const newState = cartReducer(state.value, {
        type: "ADD_TO_CART",
        payload: {
          id: product.id,
          name: product.name,
          category: product.category,
          price,
          quantity,
          variation: selectedVariation,
          images,
          specs,
          base_price: parseFloat(product.base_price),
          base_stock: product.base_stock,
          has_variations: product.has_variations === 1,
          description: product.description,
        },
      })
      state.value = newState
    } catch (error) {
      console.error("Error adding product to cart:", error)
    }
  }

  const removeFromCart = (productId, variation = null) => {
    const newState = cartReducer(state.value, {
      type: "REMOVE_FROM_CART",
      payload: { id: productId, variation },
    })
    state.value = newState
  }

  const updateQuantity = (productId, quantity, variation = null) => {
    const item = state.value.items.find(
      (i) =>
        i.id === productId && i.variation?.variation === variation?.variation
    )

    if (item) {
      const maxStock = variation ? variation.stock : item.base_stock
      if (quantity <= maxStock) {
        const newState = cartReducer(state.value, {
          type: "UPDATE_QUANTITY",
          payload: { id: productId, quantity, variation },
        })
        state.value = newState
      } else {
        console.warn("Requested quantity exceeds available stock")
      }
    }
  }

  const clearCart = () => {
    const newState = cartReducer(state.value, { type: "CLEAR_CART" })
    state.value = newState
  }

  const getCartTotal = () => {
    return state.value.items.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }

  return {
    cart: state.value.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  }
})

export const useCart = () => {
  const context = CartContext()
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}