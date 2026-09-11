import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, CartContextType } from '../types';
import { useToast } from './ToastContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('pedido-zap-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  useEffect(() => {
    localStorage.setItem('pedido-zap-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id && item.name === product.name);
      if (existingItem) {
        return prevCart.map((item) =>
          (item.id === product.id && item.name === product.name) ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    showToast(`"${product.name}" adicionado ao carrinho!`, 'success');
  };

  const removeFromCart = (productId: string, productName?: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.id === productId && (!productName || item.name === productName))));
    showToast(`Item removido do carrinho`, 'info');
  };

  const updateQuantity = (productId: string, quantity: number, productName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, productName);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id === productId && (!productName || item.name === productName)) ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        step,
        setStep,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
