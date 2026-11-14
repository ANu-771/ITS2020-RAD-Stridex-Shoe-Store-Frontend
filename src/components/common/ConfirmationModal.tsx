import type { FC } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#DCEBE0] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start space-x-4">
          <div
            className={`p-3 rounded-2xl shrink-0 ${
              isDangerous ? 'bg-[#E45D5D]/10 text-[#E45D5D]' : 'bg-[#DDF3E2] text-[#72C98A]'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-outfit text-lg font-bold text-[#26352D]">{title}</h3>
            <p className="text-xs text-[#718078] leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3 pt-4 border-t border-[#DCEBE0]">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 ${
              isDangerous
                ? 'bg-[#E45D5D] hover:bg-[#d44848]'
                : 'bg-[#72C98A] hover:bg-[#59B976]'
            }`}
          >
            {isLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
