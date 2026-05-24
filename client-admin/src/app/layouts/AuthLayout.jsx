export const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#1a3a5c] flex items-center justify-center px-4 py-6'>
      <div className='bg-white rounded-2xl shadow-2xl px-5 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 w-full max-w-md'>
        <div className='flex justify-center mb-4 sm:mb-6'>
          <img
            src='/src/assets/img/ChapinLogo.png'
            alt='Chapin Bank Logo'
            className='h-24 sm:h-32 lg:h-40 w-auto'
          />
        </div>
        <div className='text-center mb-4 sm:mb-6'>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-2 break-words'>{title}</h1>
          <p className='text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed'>
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
