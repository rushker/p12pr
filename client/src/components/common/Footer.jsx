// src/components/common/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} <span className="font-semibold text-indigo-600">QRShare</span>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
