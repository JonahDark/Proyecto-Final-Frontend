import { Comensal } from "./comensal";

export interface Mesa{
    id?:number;
    nombre?: string;
    tipoMesa?: string;        
    precio?: number;
    id_evento?: number;
    num_max_comensales_redonda?:number;
    num_max_comensales_larga?:number;
    num_max_comensales_media_luna?:number;
    comensales?:Comensal[];
}