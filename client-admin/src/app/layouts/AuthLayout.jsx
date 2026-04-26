export const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-main-blue p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border-gray-200 p-6 md:p-10">
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