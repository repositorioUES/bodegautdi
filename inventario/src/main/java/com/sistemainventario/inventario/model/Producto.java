package com.sistemainventario.inventario.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "producto")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idproducto")
    private Integer idProducto;

    @Column(name = "nombreproducto", nullable = false, length = 255)
    private String nombreproducto;

    @Column(name = "skuproducto", nullable = false, unique = true, length = 100)
    private String skuproducto;

    @Column(name = "descripcionproducto")
    private String descripcionproducto; // 'TEXT' en Postgres se mapea bien a String

    @Column(name = "preciocostoproducto", nullable = false)
    private BigDecimal preciocostoproducto; // Usar BigDecimal para dinero, no double

    @Column(name = "precioventaproducto", nullable = false)
    private BigDecimal precioventaproducto;

    // --- Relación con Categoria ---
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idcategoria") // Esta es la FK en la tabla PRODUCTO
    private Categoria categoria;

    // --- Relación con Proveedor ---
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idproveedor") // Esta es la FK en la tabla PRODUCTO
    private Proveedor proveedor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idunidadmedida")
    private UnidadMedida unidadMedida;

    public Producto() {
    }

    public Integer getIdProducto() {
        return this.idProducto;
    }

    public String getNombreproducto() {
        return this.nombreproducto;
    }

    public String getSkuproducto() {
        return this.skuproducto;
    }

    public String getDescripcionproducto() {
        return this.descripcionproducto;
    }

    public BigDecimal getPreciocostoproducto() {
        return this.preciocostoproducto;
    }

    public BigDecimal getPrecioventaproducto() {
        return this.precioventaproducto;
    }

    public Categoria getCategoria() {
        return this.categoria;
    }

    public Proveedor getProveedor() {
        return this.proveedor;
    }

    public UnidadMedida getUnidadMedida() {
        return this.unidadMedida;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public void setNombreproducto(String nombreproducto) {
        this.nombreproducto = nombreproducto;
    }

    public void setSkuproducto(String skuproducto) {
        this.skuproducto = skuproducto;
    }

    public void setDescripcionproducto(String descripcionproducto) {
        this.descripcionproducto = descripcionproducto;
    }

    public void setPreciocostoproducto(BigDecimal preciocostoproducto) {
        this.preciocostoproducto = preciocostoproducto;
    }

    public void setPrecioventaproducto(BigDecimal precioventaproducto) {
        this.precioventaproducto = precioventaproducto;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    public void setUnidadMedida(UnidadMedida unidadMedida) {
        this.unidadMedida = unidadMedida;
    }


    public String toString() {
        return "Producto(idProducto=" + this.getIdProducto() + ", nombreproducto=" + this.getNombreproducto() + ", skuproducto=" + this.getSkuproducto() + ", descripcionproducto=" + this.getDescripcionproducto() + ", preciocostoproducto=" + this.getPreciocostoproducto() + ", precioventaproducto=" + this.getPrecioventaproducto() + ", categoria=" + this.getCategoria() + ", proveedor=" + this.getProveedor() + ", unidadMedida=" + this.getUnidadMedida() + ")";
    }
}
