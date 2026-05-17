const { createContext, useContext, useState, useCallback, useMemo } = React;

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [auth, setAuth] = useState({ isLogged: false, user: null });

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const add = useCallback((product) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
    showToast(`${product.name} adicionado`);
  }, [showToast]);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + (it.price || 0), 0),
    [items]
  );

  const requireAuth = useCallback((action) => {
    if (!auth.isLogged) {
      showToast('Faça login para continuar');
      return false;
    }
    action?.();
    return true;
  }, [auth.isLogged, showToast]);

  const value = {
    items, total, isOpen, setIsOpen,
    add, remove, clear,
    auth, setAuth, requireAuth,
    toast, showToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
};

Object.assign(window, { CartContext, CartProvider, useCart });
