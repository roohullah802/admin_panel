import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useSetFaqsMutation } from "@/redux-toolkit-store/slices/rtk/apiSlices";
import { toast } from "react-toastify";

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FaqModalProps {
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const FaqModal: React.FC<FaqModalProps> = ({ open, onClose, isAdmin = false }) => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [setFaqss, { isLoading }] = useSetFaqsMutation();

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
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Please fill both question and answer.");
      return;
    }

    try {
      const payload = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      };

      // 🔥 API Call
      await setFaqss(payload).unwrap();

      toast.success("FAQ added successfully!");

      // ✅ Add to local list
      setFaqs((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          question: payload.question,
          answer: payload.answer,
        },
      ]);

      // ✅ Reset form
      setFormData({ question: "", answer: "" });
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
          <h2 className="text-xl font-semibold text-gray-800">FAQs</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Admin Add FAQ Form */}
          {isAdmin && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
              <h3 className="font-semibold text-gray-700 mb-1">Add New FAQ</h3>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Question"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                name="answer"
                value={formData.answer}
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
          {faqs.length ? (
            faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="border rounded-xl mb-2 bg-gray-50 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="flex justify-between items-center w-full px-4 py-3 text-left font-medium text-gray-800"
                >
                  {faq.question}
                  {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-3 text-sm text-gray-600 border-t pt-2">
                    {faq.answer}
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

export default FaqModal;
