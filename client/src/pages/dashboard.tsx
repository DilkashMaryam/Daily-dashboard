import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Settings, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatsOverview from "@/components/dashboard/stats-overview";
import ItemCard from "@/components/dashboard/item-card";
import AddItemModal from "@/components/dashboard/add-item-modal";
import DeleteConfirmationModal from "@/components/dashboard/delete-confirmation-modal";
import type { RoutineItem } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<RoutineItem | null>(null);
  const [editItem, setEditItem] = useState<RoutineItem | null>(null);

  const { data: items = [], isLoading } = useQuery<RoutineItem[]>({
    queryKey: ["/api/items"],
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAddModal = () => {
    setEditItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: RoutineItem) => {
    setEditItem(item);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditItem(null);
  };

  const handleDeleteConfirm = (item: RoutineItem) => {
    setDeleteItem(item);
  };

  const handleDeleteCancel = () => {
    setDeleteItem(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-slate-900">Daily Routine</h1>
                <p className="text-sm text-slate-500">
                  {items.length} quick access item{items.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              {/* Add Button */}
              <Button onClick={handleOpenAddModal} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              {/* Settings */}
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview items={items} />

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteConfirm}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchQuery ? "No items found" : "No items yet"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery 
                ? `No items match "${searchQuery}". Try a different search term.`
                : "Start building your daily routine by adding your first quick access item."
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleOpenAddModal} className="bg-blue-600 hover:bg-blue-700">
                Add Your First Item
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editItem={editItem}
      />

      <DeleteConfirmationModal
        item={deleteItem}
        onClose={handleDeleteCancel}
      />
    </div>
  );
}
