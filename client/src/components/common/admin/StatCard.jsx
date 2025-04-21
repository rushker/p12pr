// components/admin/StatCard.jsx
const StatCard = ({ icon, value, label, color }) => (
    <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
      <div className={`p-3 rounded-md bg-${color}-500`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
  
  export default StatCard;
  