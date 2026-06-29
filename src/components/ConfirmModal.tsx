"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getConfirmBtnColor = () => {
    switch (type) {
      case "danger": return "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20";
      case "warning": return "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20";
      case "info": return "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-rose-600/20 p-2 rounded-xl text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-black text-white">{title}</h3>
        </div>
        
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl font-bold text-xs transition-colors border border-white/5"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 text-white rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 ${getConfirmBtnColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
