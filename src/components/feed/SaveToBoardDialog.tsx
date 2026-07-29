import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Lock, FolderOpen } from "lucide-react";
import { useMyBoards, useCreateBoard, useSaveToBoard } from "@/hooks/useSocial";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SaveToBoardDialogProps {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SaveToBoardDialog = ({ productId, open, onOpenChange }: SaveToBoardDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: boards = [], isLoading } = useMyBoards();
  const createBoard = useCreateBoard();
  const saveToBoard = useSaveToBoard();
  const [newName, setNewName] = useState("");

  if (open && !user) {
    onOpenChange(false);
    navigate("/auth/login");
    return null;
  }

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const board = await createBoard.mutateAsync({ name: newName.trim(), isPrivate: false });
    setNewName("");
    if (productId && board?.id) {
      await saveToBoard.mutateAsync({ boardId: board.id, productId });
      onOpenChange(false);
    }
  };

  const handleSave = async (boardId: string) => {
    if (!productId) return;
    await saveToBoard.mutateAsync({ boardId, productId });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Save to a board</DialogTitle>
          <DialogDescription>
            Organise the designs you love into collections.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : boards.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              No boards yet — create your first one below.
            </p>
          ) : (
            boards.map((board) => (
              <button
                key={board.id}
                type="button"
                onClick={() => handleSave(board.id)}
                disabled={saveToBoard.isPending}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left disabled:opacity-60"
              >
                <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                <span className="flex-1 min-w-0 truncate text-sm font-medium">{board.name}</span>
                {board.is_private && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                <span className="text-xs text-muted-foreground">{board.item_count}</span>
              </button>
            ))
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New board name"
            className="bg-background border-border"
            maxLength={60}
          />
          <Button
            variant="hero"
            onClick={handleCreate}
            disabled={!newName.trim() || createBoard.isPending}
          >
            {createBoard.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveToBoardDialog;
