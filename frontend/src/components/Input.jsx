function Input({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
}) {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name} // 🔥 IMPORTANT (fix)
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border transition outline-none
          ${error ? "border-red-500" : "border-gray-300"}
          focus:ring-2 focus:ring-green-400
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
        `}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default Input;
