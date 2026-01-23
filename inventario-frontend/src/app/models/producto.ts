import { Categoria } from './categoria';
import { Proveedor } from './proveedor';
import { UnidadMedida } from './unidades-medidas';

export interface Producto {
    idProducto?: number;
    nombreproducto: string;
    skuproducto: string;
    descripcionproducto: string;
    preciocostoproducto: number;
    precioventaproducto: number;
    // Estos objetos vienen en el GET (Eager Fetch)
    categoria?: Categoria;
    proveedor?: Proveedor;
    unidadMedida?: UnidadMedida;
}

// Interfaz para el envío de datos (Coincide con tu ProductoRegistroDTO)
export interface ProductoRegistroDTO {
    idProducto?: number;
    nombreproducto: string;
    skuproducto: string;
    descripcionproducto: string;
    preciocostoproducto: number;
    precioventaproducto: number;
    idCategoria: number;
    idProveedor: number;
    idUnidadMedida: number;
}

