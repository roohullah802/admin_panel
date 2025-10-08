import React, { useCallback, useState } from "react";
import { X, Upload } from "lucide-react";
import { useAddNewCarMutation } from "@/redux-toolkit-store/slices/rtk/apiSlices";
import { toast } from "react-toastify";

interface AddNewCarModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  images: File[];
  brandImage: File[] | null;
}

const AddNewCarModal: React.FC<AddNewCarModalProps> = ({ isOpen, onClose }) => {
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
    images: [],
    brandImage: [],
  });

  const [addNewCar, { isLoading }] = useAddNewCarMutation();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;

    if (name === "images") {
      const selectedFiles = Array.from(files).slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        images: selectedFiles,
      }));
    } else if (name === "brandImage") {
      const selec = Array.from(files).slice(0, 1);
      setFormData((prev) => ({
        ...prev,
        brandImage: selec,
      }));
    }
  };

  const appendNumber = (fd: FormData, key: string, value: string) => {
    if (value && !isNaN(Number(value))) {
      fd.append(key, String(Number(value)));
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const payload = new FormData();

        const airConditionValue =
          formData.airCondition.toLowerCase() === "yes" ? "true" : "false";

        payload.append("modelName", formData.modelName.trim());
        payload.append("brand", formData.brand.trim());
        payload.append("color", formData.color.trim());
        payload.append("transmission", formData.transmission);
        payload.append("fuelType", formData.fuelType);
        payload.append("description", formData.description.trim());
        payload.append("airCondition", airConditionValue);

        appendNumber(payload, "year", formData.year);
        appendNumber(payload, "weeklyRate", formData.weeklyRate);
        appendNumber(payload, "passengers", formData.passengers);
        appendNumber(payload, "doors", formData.doors);
        appendNumber(payload, "price", formData.price);
        appendNumber(payload, "maxPower", formData.maxPower);
        appendNumber(payload, "mph", formData.mph);
        appendNumber(payload, "topSpeed", formData.topSpeed);
        appendNumber(payload, "tax", formData.tax);
        appendNumber(payload, "pricePerDay", formData.pricePerDay);
        appendNumber(payload, "initialMileage", formData.initialMileage);
        appendNumber(payload, "allowedMilleage", formData.allowedMilleage);

        formData.images.forEach((img) => {
          payload.append("images", img);
        });

        formData.brandImage?.forEach((img) => {
          payload.append("brandImage", img);
        });

        const res = await addNewCar(payload).unwrap();
        toast.success("✅ Car added successfully!");
        console.log("Response:", res);
        onClose();
      } catch (err: any) {
        console.error("Add Car Error:", err);
        const message =
          err?.data?.message ||
          err?.error ||
          "Failed to add car. Please try again.";
        toast.error(`❌ ${message}`);
      }
    },
    [formData, addNewCar, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[95vh] overflow-hidden flex flex-col mx-4 sm:mx-6">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add New Car</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Basic fields */}
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
                  value={(formData as any)[field.name]}
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

            {/* File Uploads */}
            <FileUpload
              label="Click to upload car images (max 10)"
              name="images"
              file={formData.images}
              onChange={handleFileChange}
              multiple
            />
            <FileUpload
              label="Click to upload brand logo"
              name="brandImage"
              file={formData.brandImage}
              onChange={handleFileChange}
            />

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
                {isLoading ? "Adding..." : "Add Car"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: any) => (
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

const Select = ({ label, name, value, onChange, options }: any) => (
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
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FileUpload = ({
  label,
  name,
  file,
  onChange,
  multiple = false,
}: {
  label: string;
  name: string;
  file: File[] | File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
}) => (
  <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition">
    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
      <Upload size={24} className="text-blue-600" />
      <span className="text-blue-600 font-medium text-sm">{label}</span>
      <span className="text-gray-400 text-xs">PNG, JPG up to 50MB</span>
      <input
        type="file"
        name={name}
        multiple={multiple}
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
    </label>
    {Array.isArray(file) && file.length > 0 ? (
      <p className="text-xs mt-2 text-gray-500">
        {file.length} file(s) selected
      </p>
    ) : (
      file && (
        <p className="text-xs mt-2 text-gray-500">{(file as File).name}</p>
      )
    )}
  </div>
);

export default AddNewCarModal;
