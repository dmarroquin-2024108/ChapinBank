import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export const ForgotPassword = ({ onSwitch }) => {
  const { lostPassword, loading, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (formData) => {
    const resultado = await lostPassword(formData);
    if (resultado.success) {
      toast.success("Correo enviado.", { duration: 3000 });
    } else {
      toast.error("Error al enviar el correo. Inténtelo de nuevo.", { duration: 3000 });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="correo@example.com"
          className="mt-1 w-full bg-[#E8F0FE] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          {
          ...register("email", {
            required: "Este campo es obligatorio"
          })
          }
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1">
            {errors.email.message}
          </p>
        )}
      </div>
      {error && <p className="text-red-600 text-xs text-center">{error}</p>}
      <button
        type="submit"
        className="w-full bg-orange text-white font-bold py-2 rounded-lg hover:bg-[#F2CD88] hover:cursor-pointer transition"
      >
        Mandar Token
      </button>

      <p className="text-center text-sm">
        ¿Recordaste tu contraseña?
        <button
          type="button"
          onClick={onSwitch}
          className=' p-2 text-orange hover:underline hover:cursor-pointer'
        >
          Iniciar Sesión
        </button>
      </p>
    </form>

  )
}
