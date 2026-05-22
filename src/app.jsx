/* ============================================================
   src/app.jsx — Entry point
   ============================================================ */
function App() {
  // Anima reveals em todo o documento + parallax global
  useGsapReveal();
  const { toast } = useCart();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductGrid />
        <TradeIn />
        <Features />
        <FAQ />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <Toast message={toast} />
    </>
  );
}

function Root() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<Root />);
}
