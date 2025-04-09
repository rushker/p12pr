// client/src/components/common/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} QRShare. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;