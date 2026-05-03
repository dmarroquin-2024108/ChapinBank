export const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2137] to-[#1a3a5c] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl px-10 py-10 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <img
                        src="/src/assets/img/ChapinLogo.png"
                        alt="Chapin Bank Logo"
                        className="h-40 w-auto"
                    />
                </div>
                <div className="text-center mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h1>
                    <p className="text-gray-600 text-base max-w-md mx-auto">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    );
}