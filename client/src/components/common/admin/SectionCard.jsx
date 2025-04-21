// components/admin/SectionCard.jsx
const SectionCard = ({ title, icon, children }) => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 flex items-center space-x-2">
        {icon}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
  
  export default SectionCard;
  