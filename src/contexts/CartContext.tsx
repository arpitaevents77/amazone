import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

interface CartItem {
  id: string
  cart_id: string
  variant_id: string
  asin: string
  quantity: number
  price_at_time: number
  product_name: string
  product_image: string
  variant_weight: number
  variant_weight_unit: string
  created_at: string
}

interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  loading: boolean
  addToCart: (
    variantId: string,
    asin: string,
    quantity: number,
    productDetails: any
  ) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      refreshCart()
    } else {
      setCartItems([])
    }
  }, [user])

  const getOrCreateCart = async (userId: string) => {
    const { data: existingCart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingCart) return existingCart

    const { data: newCart, error } = await supabase
      .from('carts')
      .insert([{ user_id: userId }])
      .select('id')
      .single()

    if (error) throw error
    return newCart
  }

  const refreshCart = async () => {
    if (!user) return

    try {
      setLoading(true)

      const cart = await getOrCreateCart(user.id)

      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCartItems(data || [])
    } catch (error) {
      console.error('Error refreshing cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (
    variantId: string,
    asin: string,
    quantity: number,
    productDetails: any
  ) => {
    if (!user) throw new Error('Please sign in')

    try {
      const cart = await getOrCreateCart(user.id)

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .eq('variant_id', variantId)
        .single()

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity
          })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert([
            {
              cart_id: cart.id,
              variant_id: variantId,
              asin,
              quantity,
              price_at_time: productDetails.price,
              product_name: productDetails.name,
              product_image: productDetails.image,
              variant_weight: productDetails.weight,
              variant_weight_unit: productDetails.weightUnit
            }
          ])

        if (error) throw error
      }

      await refreshCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error

      await refreshCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      await refreshCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const cart = await getOrCreateCart(user.id)

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)

      if (error) throw error

      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price_at_time * item.quantity, 0)

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const value: CartContextType = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    refreshCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}