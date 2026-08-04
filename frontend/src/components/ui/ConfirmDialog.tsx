'use client';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
          <p className="text-slate-500 text-sm">{message}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button variant="ghost" fullWidth onClick={onClose} disabled={loading} className="border border-slate-200">
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
