import { AvatarUser } from "../ui/AvatarUser.jsx";

export const Navbar = ({onLogout}) => {
    return (
        <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
            <div />
            <div className="flex items-center gap-3">
                <span className="text-xs border border-orange text-orange px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    Modo Administrador
                </span>
                    <AvatarUser onLogout={onLogout} />
            </div>
        </nav>
    );
};