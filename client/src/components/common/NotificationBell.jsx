// client/src/components/common/NotificationBell.jsx
import { BellIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../../hooks/useNotifications';
import { useEffect, useState } from 'react';

export default function NotificationBell() {
  const { list, fetch, dismiss } = useNotifications();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="relative">
      <button onClick={()=>setOpen(o=>!o)} className="relative">
        <BellIcon className="h-6 w-6 text-gray-600"/>
        {list.length>0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {list.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
          {list.length===0
            ? <div className="p-4 text-gray-500">No notifications</div>
            : list.map(n => (
                <div key={n._id} className="flex justify-between items-start p-3 border-b">
                  <div>
                    <div className="text-sm font-medium">{n.message}</div>
                    <a href={n.link} className="text-xs text-indigo-600">Take Action</a>
                  </div>
                  <button onClick={()=>dismiss(n._id)} className="ml-2">
                    <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500"/>
                  </button>
                </div>
          ))}
        </div>
      )}
    </div>
  );
}
