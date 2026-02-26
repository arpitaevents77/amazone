import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  asin: string;
  quantity: number;
  price_at_time: number;
  product_name: string;
  product_image: string;
  variant_weight: number;
  variant_weight_unit: string;
  created_at: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (
    variantId: string,
    asin: string,
    quantity: number,
    productDetails: {
      name: string;
      image: string;
      price: number;
      weight: number;
      weightUnit: string;
    }
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  // ==========================
  // GET OR CREATE CART
  // ==========================

  const getOrCreateCart = async () => {
    if (!user) return null;

    const { data: existingCart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingCart) return existingCart;

    const { data: newCart, error } = await supabase
      .from('carts')
      .insert([{ user_id: user.id }])
      .select('id')
      .single();

    if (error) throw error;

    return newCart;
  };

  // ==========================
  // REFRESH CART
  // ==========================

  const refreshCart = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const cart = await getOrCreateCart();
      if (!cart) return;

      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCartItems(data || []);
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // ADD TO CART
  // ==========================

  const addToCart = async (
    variantId: string,
    asin: string,
    quantity: number,
    productDetails: {
      name: string;
      image: string;
      price: number;
      weight: number;
      weightUnit: string;
    }
  ) => {
    if (!user) throw new Error('Please sign in to add items');

    const cart = await getOrCreateCart();
    if (!cart) throw new Error('Cart not available');

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('variant_id', variantId)
      .single();

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
        })
        .eq('id', existingItem.id);
    } else {
      await supabase.from('cart_items').insert([
        {
          cart_id: cart.id,
          variant_id: variantId,
          asin,
          quantity,
          price_at_time: productDetails.price,
          product_name: productDetails.name,
          product_image: productDetails.image,
          variant_weight: productDetails.weight,
          variant_weight_unit: productDetails.weightUnit,
        },
      ]);
    }

    await refreshCart();
  };

  // ==========================
  // UPDATE QUANTITY
  // ==========================

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) throw error;

    await refreshCart();
  };

  // ==========================
  // REMOVE ITEM
  // ==========================

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    await refreshCart();
  };

  // ==========================
  // CLEAR CART
  // ==========================

  const clearCart = async () => {
    if (!user) return;

    const cart = await getOrCreateCart();
    if (!cart) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (error) throw error;

    setCartItems([]);
  };

  // ==========================
  // CALCULATIONS
  // ==========================

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price_at_time * item.quantity,
      0
    );
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};