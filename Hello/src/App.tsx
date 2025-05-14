import Footer from "@/components/Footer";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Steps from "./components/Steps";

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
