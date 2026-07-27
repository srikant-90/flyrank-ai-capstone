import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SettingsSection } from './components/SettingsSection';
import { Workflow } from './components/Workflow';
import './App.css';

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Features />
        <SettingsSection />
        <Workflow />
      </main>
      <Footer />
    </>
  );
}

export default App;
