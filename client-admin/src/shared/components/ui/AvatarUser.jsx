import { useState, useRef, useEffect, use } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/store/authStore.js";

export const AvatarUser = () => {
    const { user } = useAuthStore();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const toggleMenu = () => setOpen((prev) => !prev);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const roleLabel = {
        SUPERADMIN_ROLE: 'SuperAdmin',
        ADMIN_ROLE: 'Administrador',
        USER_ROLER:'Usuario'
    };

    return(
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleMenu}
                className="w-9 h-9 rounded-full bg-[#0d1f35] text-white flex items-center justify-center text-sm font-bold hover:opacity-80 transition hover: cursor-pointer border-2 border-orange-30">
                    {user?.username?.slice(0, 2).toUpperCase() ?? "AD"}
            </button>
        </div>
    )
}