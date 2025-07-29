import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ExternalLink, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { RoutineItem } from "@shared/schema";

interface ItemCardProps {
  item: RoutineItem;
  onEdit: (item: RoutineItem) => void;
  onDelete: (item: RoutineItem) => void;
}

export default function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const clickMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/items/${item.id}/click`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
    },
  });

  const handleOpenItem = () => {
    clickMutation.mutate();
    window.open(item.url, "_blank");
  };

  const getFaviconUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch {
      return "";
    }
  };

  const getIconColor = (url: string): string => {
    const colors = [
      "bg-red-100 text-red-600",
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-amber-100 text-amber-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
      "bg-cyan-100 text-cyan-600",
    ];
    
    const hash = url.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-4 transition-all duration-150 hover:transform hover:-translate-y-0.5 hover:shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${getIconColor(item.url)}`}>
          <img
            src={getFaviconUrl(item.url)}
            alt=""
            className="w-5 h-5"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <ExternalLink className="w-5 h-5 hidden" />
        </div>
        <div
          className={`flex items-center space-x-1 transition-opacity duration-150 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
          >
            <GripVertical className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-blue-600"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <h3 className="font-semibold text-slate-900 mb-1 truncate" title={item.name}>
        {item.name}
      </h3>
      
      {item.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2" title={item.description}>
          {item.description}
        </p>
      )}

      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={handleOpenItem}
        disabled={clickMutation.isPending}
      >
        {clickMutation.isPending ? "Opening..." : "Open"}
      </Button>
    </div>
  );
}
