interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  invalid?: boolean;
}

const FormLabel: React.FC<FormLabelProps> = ({
  children,
  invalid,
  className = "",
  ...rest
}) => {
  return (
    <label
      className={`${className} ${invalid ? "text-red-600" : ""}`}
      {...rest}
    >
      {children}
    </label>
  );
};

export default FormLabel;
