import { Usuario } from './usuario';
import { Bodega } from './bodega'; // Asumo que tienes este modelo
import { Producto } from './producto';

export interface SolicitudCompra {
    idSolicitudCompra?: number;
    nombresolicitud: string;
    fechacreacionsolicitud?: string;
    estado: string;
    idusuariosolicitante: Usuario;
    idbodegadestino: Bodega;
    // Opcional: para mostrar detalles en la lista si el backend los manda
    detalles?: SolicitudCompraDetalle[];
}


export interface SolicitudCompraDetalle {
    idSolicitudDetalle?: number;
    producto: Producto;
    cantidad_solicitada: number;
}

// DTOs para enviar al Backend (Solo IDs)
export interface SolicitudDTO {
    nombresolicitud: string;
    idUsuarioSolicitante: number;
    idBodegaDestino: number;
}

export interface DetalleSolicitudDTO {
    idProducto: number;
    cantidad: number;
}

