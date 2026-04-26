import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore.js";

export const LoginForm = ({ onForgot, onTempPassword }) => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const res = await login(data);
        if (res.success) {
            navigate('/dashboard');
            toast.success("¡Bienvenido al sistema!", { duration: 3000 });
        }else if(res.requiresPasswordChange){
            onTempPassword();
        }else{
            toast.error(res.error, {duration: 3000});
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label
                    htmlFor="emailOrUsername"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    Email o Username
                </label>
                <input
                    type="text"
                    id="emailOrUsername"
                    placeholder="correo@example.com o Username"
                    className="mt-1 w-full bg-[#E8F0FE] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    {
                    ...register("emailOrUsername", {
                        required: "Este campo es obligatorio"
                    })
                    }
                />
                {errors.emailOrUsername && (
                    <p className="text-red-600 text-xs mt-1">
                        {errors.emailOrUsername.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    Contraseña
                </label>

                <input
                    type="password"
                    id="password"
                    placeholder="* * * * * * *"
                    className="mt-1 w-full bg-[#E8F0FE] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    {
                        ...register("password", {
                            required: "Este campo es obligatorio"
                        })
                    }
                />
                {errors.password &&(
                    <p className="text-red-600 text-xs mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange text-white font-bold py-2 rounded-lg hover:bg-[#F2CD88] transition"
            >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
            <p className="text-center text-sm text-main-blue">
                ¿Olvidaste tu Contraseña?
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-orange hover:underline hover:cursor-pointer ml-1"
                >
                    Recuperar Contraseña
                </button>
            </p>
        </form>
    )
}
