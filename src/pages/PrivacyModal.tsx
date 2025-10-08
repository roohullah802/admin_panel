import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useSetPolicyMutation } from "@/redux-toolkit-store/slices/rtk/apiSlices";
import { toast } from "react-toastify";

interface Priv {
  id: number;
  title: string;
  description: string;
}

interface PrivModalProps {
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const PrivacyModal: React.FC<PrivModalProps> = ({ open, onClose, isAdmin = false }) => {
  const [privacy, setPrivacy] = useState<Priv[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [setPolicy, { isLoading }] = useSetPolicyMutation();

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill both question and answer.");
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      // 🔥 API Call
      await setPolicy(payload).unwrap();

      toast.success("FAQ added successfully!");

      // ✅ Add to local list
      setPrivacy((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          title: payload.title,
          description: payload.description,
        },
      ]);

      // ✅ Reset form
      setFormData({ title: "", description: "" });
    } catch (error: any) {
      console.error("Add FAQ Error:", error);
      const message =
        error?.data?.message ||
        error?.error ||
        "Something went wrong while adding FAQ.";
      toast.error(message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Privacy Policy</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Admin Add FAQ Form */}
          {isAdmin && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
              <h3 className="font-semibold text-gray-700 mb-1">Add New Privacy Policy</h3>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Question"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Answer"
                className="w-full border rounded-lg p-2 h-20 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`px-5 py-2 rounded-lg text-white flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Adding...
                  </>
                ) : (
                  "Add FAQ"
                )}
              </button>
            </form>
          )}

          {/* FAQ List */}
          {privacy.length ? (
            privacy.map((priv, index) => (
              <div
                key={priv.id}
                className="border rounded-xl mb-2 bg-gray-50 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="flex justify-between items-center w-full px-4 py-3 text-left font-medium text-gray-800"
                >
                  {priv.title}
                  {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-3 text-sm text-gray-600 border-t pt-2">
                    {priv.description}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No FAQs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
