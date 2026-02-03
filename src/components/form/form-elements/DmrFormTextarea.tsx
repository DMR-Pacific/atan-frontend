interface DmrFormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  feedbackInvalid?: string;
}

const DmrFormTextarea: React.FC<DmrFormTextareaProps> = ({
  invalid,
  feedbackInvalid,
  className = "",
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1">
      <textarea
        className={`
          block w-full rounded-lg border px-3 py-2 text-sm 
          outline-none transition min-h-[100px] resize-y
          ${invalid ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}
          ${className}
        `}
        {...rest}
      />

      {invalid && feedbackInvalid && (
        <p className="text-sm text-red-600">{feedbackInvalid}</p>
      )}
    </div>
  );
};

export default DmrFormTextarea;
