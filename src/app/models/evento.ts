import { Decoracion } from "./decoracion";
import { Menu } from "./menu";
import { Mesa } from "./mesa";
import { Ubicacion } from "./ubicacion";
import { Usuario } from "./usuario";

export interface Evento {
    id?: number;
    nombre?:string;
    tipo?: string;
    fecha?: string;
    horario?: string;
    pago_confirmado?: boolean;
    precio_total?: number;
    id_usuario?: number
    id_decoracion?: number;
    id_menu?: number;
    id_ubicacion?: number;
    usuario?:Usuario;
    decoracion?:Decoracion;
    menu?:Menu;
    ubicacion?:Ubicacion;
    mesas?:Mesa[];
}