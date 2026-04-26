import { Link, useLocation } from "react-router-dom";
import imgInicio from "../../../assets/img/inicio.png";
import imgCuenta from "../../../assets/img/cuentas.png";
import imgDepositos from "../../../assets/img/depositos.png";
import imgHistorial from "../../../assets/img/historial.png";
import imgTransferencia from "../../../assets/img/transferencia.png";

export const Sidebar = () => {
  const location = useLocation();

  const items = [
    { label: 'Inicio' },
    { label: 'Cuentas' },
    { label: 'Depósitos' },
    { label: 'Historial' },
    { label: 'Transferencias' },
    { label: 'Productos' }
  ]

  return (
    <aside className="w-64 bg-main-blue text-white flex flex-col">
      <h1 className="p-4 text-center"><span className="text-2xl font-bold text-white">
        Chapin
      </span>
        <span className="text-2xl font-bold text-orange">
          Bank
        </span></h1>
      <nav className="flex-1 mt-4">
        <ul>
          <li className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-orange-400 hover:bg-opacity-70 transition-colors duration-200 border-l-4 border-yellow-400">
            <img src={imgInicio}
              alt="imgInicio"
              className="w-5 h-5" /> Inicio
          </li>

          <li className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-orange-400 hover:bg-opacity-70 transition-colors duration-200 border-l-4 border-yellow-400">
            <img src={imgCuenta}
              alt="imgCuentas"
              className="w-5 h-5" /> Cuentas
          </li>

          <li className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-orange-400 hover:bg-opacity-70 transition-colors duration-200 border-l-4 border-yellow-400">
            <img src={imgDepositos}
              alt="imgDeposito"
              className="w-5 h-5" /> Depósitos
          </li>

          <li className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-orange-400 hover:bg-opacity-70 transition-colors duration-200 border-l-4 border-yellow-400">
            <img src={imgHistorial}
              alt="imgHistorial"
              className="w-5 h-5" /> Historial
          </li>

          <li className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-orange-400 hover:bg-opacity-70 transition-colors duration-200 border-l-4 border-yellow-400">
            <img src={imgTransferencia}
              alt="imgTransferencia"
              className="w-5 h-5" /> Transferencias
          </li>
        </ul>
      </nav>
    </aside>
  )
}
