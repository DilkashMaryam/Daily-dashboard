import { Link, MousePointer, Star, Clock } from "lucide-react";
import type { RoutineItem } from "@shared/schema";

interface StatsOverviewProps {
  items: RoutineItem[];
}

export default function StatsOverview({ items }: StatsOverviewProps) {
  const totalClicks = items.reduce((sum, item) => sum + item.clickCount, 0);
  const mostUsedItem = items.reduce((prev, current) => 
    current.clickCount > prev.clickCount ? current : prev, 
    items[0] || { name: "None", clickCount: 0 }
  );
  
  const lastAddedItem = items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  
  const lastAddedTime = lastAddedItem 
    ? formatTimeAgo(new Date(lastAddedItem.createdAt))
    : "Never";

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Link className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Total Items</p>
            <p className="text-2xl font-semibold text-slate-900">{items.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <MousePointer className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Total Clicks</p>
            <p className="text-2xl font-semibold text-slate-900">{totalClicks}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Star className="h-5 w-5 text-amber-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Most Used</p>
            <p className="text-base font-semibold text-slate-900 truncate">
              {mostUsedItem.name}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Last Added</p>
            <p className="text-base font-semibold text-slate-900">{lastAddedTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
}
