/*==============================================================*/
/* DBMS name:      PostgreSQL 8                                 */
/* Created on:     03/01/2017 10:55:09                          */
/*==============================================================*/


drop table AUTO_PAGO;

drop table ORDENES_COBROS;

drop table ORDEN_COBRO;

/*==============================================================*/
/* Table: AUTO_PAGO                                             */
/*==============================================================*/
create table AUTO_PAGO (
   ID_AUTO_PAGO         SERIAL not null,
   CODIGOCATASTRAL      TEXT                 null,
   ANO                  TEXT                 null,
   FECHA_INGRESO        TEXT                 null,
   constraint PK_AUTO_PAGO primary key (ID_AUTO_PAGO)
);

/*==============================================================*/
/* Table: ORDENES_COBROS                                        */
/*==============================================================*/
create table ORDENES_COBROS (
   ID_ORDENES           SERIAL not null,
   CODIGOCATASTRAL      TEXT                 null,
   ANO                  TEXT                 null,
   FECHAINGRESO         TEXT                 null,
   ANOMIN               TEXT                 null,
   constraint PK_ORDENES_COBROS primary key (ID_ORDENES)
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
   constraint PK_ORDEN_COBRO primary key (CODIGOCATASTRAL, ANO)
);

alter table AUTO_PAGO
   add constraint FK_AUTO_PAG_REFERENCE_ORDEN_CO foreign key (CODIGOCATASTRAL, ANO)
      references ORDEN_COBRO (CODIGOCATASTRAL, ANO)
      on delete restrict on update restrict;

alter table ORDENES_COBROS
   add constraint FK_ORDENES__REFERENCE_ORDEN_CO foreign key (CODIGOCATASTRAL, ANO)
      references ORDEN_COBRO (CODIGOCATASTRAL, ANO)
      on delete restrict on update restrict;

