import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Loader2, FileText } from "lucide-react";
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

      await setFaqss(payload).unwrap();

      toast.success("✅ FAQ added successfully!");

      setFaqs((prev) => [
        ...prev,
        { id: prev.length + 1, question: payload.question, answer: payload.answer },
      ]);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-lg relative overflow-hidden">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>

        {/* Icon and Title */}
        <div className="flex flex-col items-center mt-6">
          <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-3">
            <FileText size={28} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-sm mb-4">Manage or view FAQs easily.</p>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {/* Admin Form */}
          {isAdmin && (
            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
              <h3 className="font-semibold text-gray-700">Add New FAQ</h3>
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
                className={`px-5 py-2 rounded-lg text-white flex items-center justify-center gap-2 w-full ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
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
                  {openIndex === index ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-3 text-sm text-gray-600 border-t pt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No FAQs added yet.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqModal;
