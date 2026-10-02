import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, Toast } from '../types';
import { products as initialProducts } from '../data/products';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  selectedCategory: string;
  searchQuery: string;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isLoginOpen: boolean;
  quickViewProduct: Product | null;
  toasts: Toast[];
  user: { name: string; phone?: string; isLoggedIn: boolean } | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsLoginOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  loginUser: (phoneOrEmail: string) => void;
  logoutUser: () => void;
  cartCount: number;
  cartTotal: number;
  cartSavings: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fk_cart');
      return saved ? JSON.parse(saved) : [
        { product: initialProducts[0], quantity: 1 }
      ];
    } catch {
      return [{ product: initialProducts[0], quantity: 1 }];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fk_wishlist');
      return saved ? JSON.parse(saved) : ['cf-prod-spoon'];
    } catch {
      return ['cf-prod-spoon'];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [user, setUser] = useState<{ name: string; phone?: string; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('fk_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('fk_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Item added to Cart: ${product.name}`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed from your Wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Added to your Wishlist`, 'success');
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const loginUser = (phoneOrEmail: string) => {
    setUser({
      name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Flipkart Shopper',
      phone: phoneOrEmail,
      isLoggedIn: true,
    });
    setIsLoginOpen(false);
    showToast('Logged in successfully! Welcome to Chilly Flakes Plus.');
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Logged out of account.', 'info');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const cartSavings = cart.reduce(
    (total, item) => total + Math.max(0, item.product.originalPrice - item.product.price) * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        selectedCategory,
        searchQuery,
        isCartOpen,
        isSearchOpen,
        isLoginOpen,
        quickViewProduct,
        toasts,
        user,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setSelectedCategory,
        setSearchQuery,
        setIsCartOpen,
        setIsSearchOpen,
        setIsLoginOpen,
        setQuickViewProduct,
        showToast,
        loginUser,
        logoutUser,
        cartCount,
        cartTotal,
        cartSavings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
