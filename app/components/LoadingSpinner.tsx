interface LoadingSpinnerProps {
  size?: string;
}

export default function LoadingSpinner({ size }: LoadingSpinnerProps = {}) {
  const sizeClasses = size === 'small' ? 'w-6 h-6' : 'w-12 h-12';
  
  return (
    <div className="flex justify-center items-center p-8">
      <div className="relative">
        <div className={`${sizeClasses} rounded-full absolute border-4 border-solid border-gray-200`}></div>
        <div className={`${sizeClasses} rounded-full animate-spin absolute border-4 border-solid border-xandcastle-purple border-t-transparent`}></div>
      </div>
    </div>
  );
}

// Named export for backwards compatibility
export { LoadingSpinner };