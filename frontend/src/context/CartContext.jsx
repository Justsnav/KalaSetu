import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('kalasetu_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kalasetu_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item._id === product._id);
      const availableStock = product.stock !== undefined ? product.stock : 999;

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, availableStock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        const initialQty = Math.min(quantity, availableStock);
        return [
          ...prevItems,
          {
            _id: product._id,
            title: product.title,
            price: Number(product.price),
            image: Array.isArray(product.image) ? product.image[0] : (product.image || ''),
            category: product.category,
            artForm: product.artForm,
            stock: product.stock,
            artisan: product.artistId,
            quantity: initialQty
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item._id === productId) {
          const maxStock = item.stock !== undefined ? item.stock : 999;
          return {
            ...item,
            quantity: Math.min(newQuantity, maxStock)
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('kalasetu_cart');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
