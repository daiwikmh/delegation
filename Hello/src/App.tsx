import Footer from "@/components/Footer";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <div className="page">
      <main className="main">
        <Navbar/>
<Hero/>
      </main>
      <Footer />
    </div>
  );
}

export default App;
