import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { SolicitudCompra, SolicitudCompraDetalle } from '../models/solicitud-compra';

@Injectable({
  providedIn: 'root',
})
export class PdfService {

  constructor() {}

  generarPdfSolicitud(solicitud: SolicitudCompra, detalles:SolicitudCompraDetalle[]){
    const doc = new jsPDF();

    // POSICIÓN PARA EL LOGO
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14; 
    const logoWidth = 40; // Ancho del logo en mm
    const logoHeight = 20; // Alto del logo en mm
    const xPos = pageWidth - logoWidth - margin; // Cálculo para la derecha
    const yPos = 10; // Margen superior
    const logoUrl = 'assets/images/dgcp-logo.jpg'; 
    
    const img = new Image();
    img.src = logoUrl;

    doc.addImage(img, 'GIF', xPos, yPos, logoWidth, logoHeight);


    // CABECERA DE LA SOLICITUD
    doc.setFontSize(18);
    doc.setTextColor(63, 81, 181); // Tu color primario (Indigo)
    doc.text('INVENTARIO UTDI', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Reporte de Solicitud de Compra', 14, 26);
    doc.text(`Fecha de Impresión: ${new Date().toLocaleDateString()}`, 14, 31);

    // CARD DATOS DE LA SOLICITUD
    doc.setDrawColor(220);
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(14, 38, 182, 35, 3, 3, 'FD'); 

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Presupuesto # ${solicitud.idSolicitudCompra} - ${solicitud.nombresolicitud}`, 20, 48);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Solicitante:`, 20, 56);
    doc.text(`Destino:`, 100, 56);
    doc.text(`Estado:`, 20, 64);
    doc.text(`Fecha Creación:`, 100, 64);

    doc.setFontSize(10);
    doc.setTextColor(0); // Negro
    doc.setFont('helvetica', 'bold');
    doc.text(solicitud.idusuariosolicitante.nombreusuario, 45, 56);
    doc.text(solicitud.idbodegadestino.nombrebodega, 120, 56);
    doc.text(solicitud.estado, 45, 64);
    doc.text(new Date(solicitud.fechacreacionsolicitud!).toLocaleDateString(), 130, 64);

    //AGREGAR LOS PRODUCTOS AL DETALLE
    const columnas = ['#', 'SKU', 'Producto', 'Cantidad', 'Precio', 'Subtotal'];

    const data = detalles.map((item,index) => [
      index + 1,
      item.producto.skuproducto,
      item.producto.nombreproducto,
      item.cantidad_solicitada,
    `$${item.producto.preciocostoproducto.toFixed(2)}`,
    `$${(item.cantidad_solicitada * item.producto.preciocostoproducto).toFixed(2)}`
    ]);

    //CALCULAR EL TOTAL DEL DETALLE DE PRODUCTOS
    const total = detalles.reduce((acc,curr) => acc + (curr.cantidad_solicitada * curr.producto.preciocostoproducto),0);

    autoTable(doc, {
      startY: 80,
      head: [columnas],
      body: data,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right' },
        5: { halign: 'right', fontStyle: 'bold' }
      },
      didDrawPage: (data) => {
        // Footer 
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL ESTIMADO: $${total.toFixed(2)}`, 140, finalY, { align: 'left' });

    // FIRMAS
    doc.setDrawColor(0);
    doc.line(20, finalY + 40, 80, finalY + 40); 
    doc.line(120, finalY + 40, 180, finalY + 40); 
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Firma Solicitante', 35, finalY + 45);
    doc.text('Firma Autorización', 135, finalY + 45);

    // Abrir el PDF en nueva pestaña (o usar .save('nombre.pdf') para descargar)
    window.open(doc.output('bloburl'), '_blank');

  }
  
}
