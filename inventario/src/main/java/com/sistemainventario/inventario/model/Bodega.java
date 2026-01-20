package com.sistemainventario.inventario.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "bodega")
public class Bodega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idbodega")
    private Integer idBodega;

    @Column(name = "nombrebodega", nullable = false, length = 150)
    private String nombrebodega;

    @Column(name = "direccionbodega", length = 255)
    private String direccionbodega;

    @Column(name = "telefonobodega", length = 20)
    private String telefonobodega;

    public Bodega() {
    }

    public Integer getIdBodega() {
        return this.idBodega;
    }

    public String getNombrebodega() {
        return this.nombrebodega;
    }

    public String getDireccionbodega() {
        return this.direccionbodega;
    }

    public String getTelefonobodega() {
        return this.telefonobodega;
    }

    public void setIdBodega(Integer idBodega) {
        this.idBodega = idBodega;
    }

    public void setNombrebodega(String nombrebodega) {
        this.nombrebodega = nombrebodega;
    }

    public void setDireccionbodega(String direccionbodega) {
        this.direccionbodega = direccionbodega;
    }

    public void setTelefonobodega(String telefonobodega) {
        this.telefonobodega = telefonobodega;
    }


    public String toString() {
        return "Bodega(idBodega=" + this.getIdBodega() + ", nombrebodega=" + this.getNombrebodega() + ", direccionbodega=" + this.getDireccionbodega() + ", telefonobodega=" + this.getTelefonobodega() + ")";
    }
}
