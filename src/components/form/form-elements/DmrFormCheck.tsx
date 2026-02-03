interface DmrFormCheckProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  invalid?: boolean;
  feedbackInvalid?: string;
  type?: "checkbox" | "radio";
}

const DmrFormCheck: React.FC<DmrFormCheckProps> = ({
  label,
  invalid,
  feedbackInvalid,
  className = "",
  type = "checkbox",
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type={type}
          className={`
            h-4 w-4 text-blue-600 border-gray-300 rounded
            focus:ring-blue-500
            ${invalid ? "border-red-500 text-red-600" : ""}
            ${className}
          `}
          {...rest}
        />
        <span className="text-sm">{label}</span>
      </label>

      {invalid && feedbackInvalid && (
        <p className="text-sm text-red-600 ml-6">{feedbackInvalid}</p>
      )}
    </div>
  );
};

export default DmrFormCheck;
