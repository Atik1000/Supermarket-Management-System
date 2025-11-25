export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`inline-block animate-spin rounded-full border-b-2 border-indigo-600 ${sizeStyles[size]}`} />
    </div>
  );
};

export const LoadingPage = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};
