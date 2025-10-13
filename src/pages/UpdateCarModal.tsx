import React, { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUpdateCarMutation } from "@/redux-toolkit-store/slices/rtk/apiSlices";
import { toast } from "react-toastify";

interface UpdateCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string;
  initialData?: Partial<FormDataType>;
  onUpdated?: () => void;
}

interface FormDataType {
  modelName: string;
  brand: string;
  year: string;
  color: string;
  weeklyRate: string;
  passengers: string;
  doors: string;
  airCondition: string;
  maxPower: string;
  mph: string;
  topSpeed: string;
  price: string;
  tax: string;
  pricePerDay: string;
  initialMileage: string;
  allowedMilleage: string;
  transmission: string;
  fuelType: string;
  description: string;
}

const UpdateCarModal: React.FC<UpdateCarModalProps> = ({
  isOpen,
  onClose,
  carId,
  initialData,
  onUpdated,
}) => {
  const [formData, setFormData] = useState<FormDataType>({
    modelName: "",
    brand: "",
    year: "",
    color: "",
    weeklyRate: "",
    passengers: "",
    doors: "",
    airCondition: "",
    maxPower: "",
    mph: "",
    topSpeed: "",
    price: "",
    tax: "",
    pricePerDay: "",
    initialMileage: "",
    allowedMilleage: "",
    transmission: "",
    fuelType: "",
    description: "",
  });

  const [updateCar, { isLoading }] = useUpdateCarMutation();

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(initialData).map(([key, val]) => [key, val ?? ""])
        ),
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const airCondition = formData.airCondition === "yes" ? true : false;
      try {
        const payload = {
          modelName: formData.modelName,
          brand: formData.brand.trim(),
          color: formData.color.trim(),
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          description: formData.description.trim(),
          airCondition: airCondition,
          year: Number(formData.year),
          weeklyRate: Number(formData.weeklyRate),
          passengers: Number(formData.passengers),
          doors: Number(formData.doors),
          price: Number(formData.price),
          maxPower: Number(formData.maxPower),
          mph: Number(formData.mph),
          topSpeed: Number(formData.topSpeed),
          tax: Number(formData.tax),
          pricePerDay: Number(formData.pricePerDay),
          initialMileage: Number(formData.initialMileage),
          allowedMilleage: Number(formData.allowedMilleage),
        };

        await updateCar({ carId, ...payload }).unwrap();
        toast.success("🚗 Car updated successfully!");
        onUpdated?.();
        onClose();
      } catch (error) {
        if (typeof error === "object" && error !== null && "data" in error) {
          const err = error as { data?: { message?: string } };
          toast(err.data?.message || "Failed to update car. Please try again.");
        } else if (error instanceof Error) {
          toast(error.message);
        } else {
          toast("Unexpected error");
        }
      }
    },
    [formData, updateCar, carId, onClose, onUpdated]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[95vh] overflow-hidden flex flex-col mx-4 sm:mx-6">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Update Car</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Car Name"
                name="modelName"
                value={formData.modelName}
                onChange={handleChange}
              />
              <Input
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />

              {/* Year */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 40 }).map((_, i) => {
                    const y = new Date().getFullYear() - i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>
              </div>

              <Input
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />

              {/* Numeric Fields */}
              {[
                { name: "weeklyRate", label: "Weekly Price ($)" },
                { name: "pricePerDay", label: "Price Per Day ($)" },
                { name: "passengers", label: "Passengers" },
                { name: "doors", label: "Doors" },
                { name: "maxPower", label: "Max Power" },
                { name: "mph", label: "MPH" },
                { name: "topSpeed", label: "Top Speed" },
                { name: "tax", label: "Tax (%)" },
                { name: "initialMileage", label: "Initial Mileage" },
                { name: "allowedMilleage", label: "Allowed Mileage" },
                { name: "price", label: "Price ($)" },
              ].map((field) => (
                <Input
                  key={field.name}
                  type="number"
                  label={field.label}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                />
              ))}

              {/* Selects */}
              <Select
                label="Air Condition"
                name="airCondition"
                value={formData.airCondition}
                onChange={handleChange}
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />
              <Select
                label="Transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                options={[
                  { label: "Manual", value: "manual" },
                  { label: "Automatic", value: "automatic" },
                ]}
              />
              <Select
                label="Fuel Type"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                options={[
                  { label: "Petrol", value: "petrol" },
                  { label: "Diesel", value: "diesel" },
                  { label: "Electric", value: "electric" },
                  { label: "Hybrid", value: "hybrid" },
                ]}
              />

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-5 py-2 rounded-lg text-white ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                {isLoading ? "Updating..." : "Update Car"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ---------- Reusable Input ----------
interface InputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
}
const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
      required
    />
  </div>
);

// ---------- Reusable Select ----------
interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
}
const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
      required
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default UpdateCarModal;
