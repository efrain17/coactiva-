/*==============================================================*/
/* DBMS name:      PostgreSQL 8                                 */
/* Created on:     5/1/2017 13:35:14                            */
/*==============================================================*/


drop table AUTO_PAGO;

drop table DETALLE_ORDENES_COBROS;

drop table ORDEN_COBRO;

/*==============================================================*/
/* Table: AUTO_PAGO                                             */
/*==============================================================*/
create table AUTO_PAGO (
   ID_AUTO_PAGO         SERIAL not null,
   CODIGOCATASTRAL      TEXT                 null,
   ANO                  TEXT                 null,
   ANOMAX               TEXT                 null,
   FECHA_INGRESO        TEXT                 null,
   constraint PK_AUTO_PAGO primary key (ID_AUTO_PAGO)
);

/*==============================================================*/
/* Table: DETALLE_ORDENES_COBROS                                */
/*==============================================================*/
create table DETALLE_ORDENES_COBROS (
   ID_ORDENES           SERIAL not null,
   CODIGOCATASTRAL      TEXT                 null,
   ANO                  TEXT                 null,
   ANOMAX               TEXT                 null,
   FECHAINGRESO         TEXT                 null,
   constraint PK_DETALLE_ORDENES_COBROS primary key (ID_ORDENES)
);

/*==============================================================*/
/* Table: ORDEN_COBRO                                           */
/*==============================================================*/
create table ORDEN_COBRO (
   ID_ORDEN             SERIAL not null,
   CODIGOCATASTRAL      TEXT                 not null,
   NOMBRES              TEXT                 null,
   ESTADO               TEXT                 null,
   VALOR                TEXT                 null,
   ANO                  TEXT                 not null,
   DIRECCION            TEXT                 null,
   ANOMAX               TEXT                 not null,
   constraint PK_ORDEN_COBRO primary key (CODIGOCATASTRAL, ANO, ANOMAX)
);

alter table AUTO_PAGO
   add constraint FK_AUTO_PAG_REFERENCE_ORDEN_CO foreign key (CODIGOCATASTRAL, ANO, ANOMAX)
      references ORDEN_COBRO (CODIGOCATASTRAL, ANO, ANOMAX)
      on delete restrict on update restrict;

alter table DETALLE_ORDENES_COBROS
   add constraint FK_DETALLE__REFERENCE_ORDEN_CO foreign key (CODIGOCATASTRAL, ANO, ANOMAX)
      references ORDEN_COBRO (CODIGOCATASTRAL, ANO, ANOMAX)
      on delete restrict on update restrict;

