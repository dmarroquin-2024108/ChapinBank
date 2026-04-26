import { useSearchParams, useNavigate, replace } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { AuthLayout } from "../../../app/layouts/AuthLayout.jsx"

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const { resetPassword, loading, error } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (formData) => {
        const resultado = await resetPassword({ token, NewPassword: formData.NewPassword });
        if (resultado.success) {
            toast.success("Constraseña Actualizada", { duration: 3000 });
            navigate("/", {replace: true});
        } else {
            toast.error("El enlace ya expiró o no es válido, solicite uno nuevo", { duration: 4000 });
        }
    }

    return (
        <AuthLayout
            title={<span className="text-main-blue">Cambiar Contraseña</span>}
            subtitle="Ingresa tu nueva contraseña"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        id="NewPassword"
                        placeholder="* * * * * *"
                        className="mt-1 mb-5 w-full bg-[#E8F0FE] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                        {...register("NewPassword", { required: "Este campo es obligatorio" })}
                    />

                    {errors.NewPassword && (
                        <p className="text-red-600 text-xs mt-1">
                            {errors.NewPassword.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange text-white font-bold py-2 rounded-lg hover:bg-[#F2CD88] hover:cursor-pointer transition disabled:opacity-60"
                    >
                        {loading ? "Cambiando..." : "Cambiar contraseña"}
                    </button>

                    <p className="text-center text-sm">
                        ¿Recordaste tu contraseña?
                        <button
                            type="button"
                            onClick={() => navigate("/", {replace: true})}
                            className=' p-2 text-orange hover:underline hover:cursor-pointer'
                        >
                            Iniciar Sesión
                        </button>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}