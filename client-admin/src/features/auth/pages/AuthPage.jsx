import { useState } from "react"
import { LoginForm } from "../components/LoginForm.jsx"
import { ForgotPassword } from "../components/ForgotPassword.jsx";
import { AuthLayout } from "../../../app/layouts/AuthLayout.jsx";
import { ChangeTempPasswordModal } from "../components/ChangeTempPasswordModal.jsx";

export const AuthPage = () => {
    const [isForgot, setIsForgot] = useState(false);
    const [showTempModal, setShowTempModal] = useState(false); 
    const title = isForgot
        ? <span className="text-main-blue">Recuperar Contraseña</span>
        : <><span className="text-main-blue">Chapin</span><span className="text-orange">Bank</span></>

    const subtitle = isForgot
        ? 'Ingresa tu correo para recuperar tu acceso'
        : 'Ingresa a tu cuenta de ChapinBank'

    return (
        <AuthLayout title={title} subtitle={subtitle}>
            {isForgot
                ? <ForgotPassword onSwitch={() => setIsForgot(false)} />
                : <LoginForm onForgot={() => setIsForgot(true)}  
                            onTempPassword={() => setShowTempModal(true)}
                />
            }

            {showTempModal && (
                <ChangeTempPasswordModal onClose={() => setShowTempModal(false)} />
            )}
        </AuthLayout>
    );
}
