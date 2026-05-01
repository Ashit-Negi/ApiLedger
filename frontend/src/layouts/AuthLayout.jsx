function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-200 to-green-500 items-center justify-center">
        <div className="text-white text-3xl font-bold">
          MeterFlow
          <p className="text-lg font-normal mt-2">API Billing Platform</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
