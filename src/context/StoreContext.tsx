import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, Toast } from '../types';
import { products as initialProducts } from '../data/products';
import { productsApi, authApi } from '../api';

interface StoreContextType {
  products: Product[];
  isLoadingProducts: boolean;
  isBackendConnected: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  wishlist: string[];
  selectedCategory: string;
  searchQuery: string;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isLoginOpen: boolean;
  quickViewProduct: Product | null;
  selectedProduct: Product | null;
  toasts: Toast[];
  user: { name: string; phone?: string; email?: string; isLoggedIn: boolean } | null;
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
  setSelectedProduct: (product: Product | null) => void;
  openProductPage: (product: Product) => void;
  closeProductPage: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  loginUser: (phoneOrEmail: string, passwordOrOtp?: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  cartSavings: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fk_cart');
      return saved ? JSON.parse(saved) : [{ product: initialProducts[0], quantity: 1 }];
    } catch {
      return [{ product: initialProducts[0], quantity: 1 }];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fk_wishlist');
      return saved ? JSON.parse(saved) : ['prod-face-cream'];
    } catch {
      return ['prod-face-cream'];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const prodId = hash.replace('#product/', '');
        return initialProducts.find((p) => p.id === prodId) || null;
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [user, setUser] = useState<{ name: string; phone?: string; email?: string; isLoggedIn: boolean } | null>(null);

  /**
   * Fetch products from Django backend on mount with fallback to local curated data.
   */
  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const res = await productsApi.getProducts();
      if (res.data && res.data.length > 0) {
        setProducts(res.data);
      }
      setIsBackendConnected(!res.isMock);
    } catch (err) {
      console.warn('[Django API] Error loading products:', err);
      setIsBackendConnected(false);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    // Check if user session already exists
    authApi.getCurrentUser().then((res) => {
      if (res.data && res.data.isLoggedIn) {
        setUser(res.data);
      }
    });
  }, [loadProducts]);

  // URL Hash syncing for deep links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const prodId = hash.replace('#product/', '');
        const found = products.find((p) => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (!hash.startsWith('#product')) {
        setSelectedProduct(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [products]);

  const openProductPage = (product: Product) => {
    setSelectedProduct(product);
    setQuickViewProduct(null);
    window.history.pushState({ productId: product.id }, '', `#product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProductPage = () => {
    setSelectedProduct(null);
    if (window.location.hash.startsWith('#product')) {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('fk_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('fk_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

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
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
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
        showToast(`Removed from your wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved ${product.name} to wishlist`, 'success');
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const loginUser = async (phoneOrEmail: string, passwordOrOtp = '1234'): Promise<boolean> => {
    try {
      const res = await authApi.login(phoneOrEmail, passwordOrOtp);
      if (res.data?.user) {
        setUser(res.data.user);
        setIsLoginOpen(false);
        showToast('Logged in successfully! Welcome to Chilly Flakes.', 'success');
        return true;
      }
    } catch (err) {
      console.error('[Django Auth] Login failed:', err);
    }
    return false;
  };

  const logoutUser = async () => {
    await authApi.logout();
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
        isLoadingProducts,
        isBackendConnected,
        refreshProducts: loadProducts,
        cart,
        wishlist,
        selectedCategory,
        searchQuery,
        isCartOpen,
        isSearchOpen,
        isLoginOpen,
        quickViewProduct,
        selectedProduct,
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
        setSelectedProduct,
        openProductPage,
        closeProductPage,
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
