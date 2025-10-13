import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Loader2, ShieldCheck } from "lucide-react";
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

const PrivacyModal: React.FC<PrivModalProps> = ({
  open,
  onClose,
  isAdmin = false,
}) => {
  const [privacy, setPrivacy] = useState<Priv[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [setPolicy, { isLoading }] = useSetPolicyMutation();

  if (!open) return null;

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
      toast.error("Please fill both title and description.");
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      await setPolicy(payload).unwrap();
      toast.success("Privacy policy added successfully!");

      setPrivacy((prev) => [...prev, { id: prev.length + 1, ...payload }]);
      setFormData({ title: "", description: "" });
    } catch (error) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as { data?: { message?: string } };
        toast(err.data?.message || "Something went wrong while adding policy.");
      } else if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("Unexpected error");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-xl">
          <div className="flex items-center gap-2 text-black">
            <ShieldCheck size={22} />
            <h2 className="text-lg font-semibold">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-200 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 bg-gray-50">
          {/* Admin Add Form */}
          {isAdmin && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 space-y-3 bg-white border rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <ShieldCheck size={18} className="text-blue-700" />
                Add New Policy
              </h3>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter policy title"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter policy description"
                className="w-full border rounded-lg p-2 h-20 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`px-5 py-2 rounded-lg text-white flex items-center justify-center gap-2 w-full ${
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
                  "Add Policy"
                )}
              </button>
            </form>
          )}

          {/* Policy List */}
          {privacy.length ? (
            privacy.map((priv, index) => (
              <div
                key={priv.id}
                className="border rounded-xl mb-2 bg-white shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="flex justify-between items-center w-full px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={18}
                      className="text-blue-700 flex-shrink-0"
                    />
                    {priv.title}
                  </div>
                  {openIndex === index ? (
                    <ChevronUp size={18} className="text-blue-600" />
                  ) : (
                    <ChevronDown size={18} className="text-blue-600" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-3 text-sm text-gray-600 border-t pt-2">
                    {priv.description}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No policies added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
