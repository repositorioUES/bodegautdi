package com.sistemainventario.inventario.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

    @Data // Lombok nos da getters/setters/constructor
    @Embeddable // Se "incrustará" como un ID
    public class InventarioId implements Serializable {

        @Column(name = "idproducto")
        private Integer idProducto;

        @Column(name = "idbodega")
        private Integer idBodega;

        // --- IMPORTANTE: Se necesitan equals() y hashCode() para IDs compuestos ---
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            InventarioId that = (InventarioId) o;
            return Objects.equals(idProducto, that.idProducto) &&
                    Objects.equals(idBodega, that.idBodega);
        }

        @Override
        public int hashCode() {
            return Objects.hash(idProducto, idBodega);
        }
}
