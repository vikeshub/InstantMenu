import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  return (
    <div className="">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1>Welcome to InstantMenu!</h1>
        <p>This is the landing page.</p>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
