drop table AUTO_PAGO;

drop table ORDENES_COBROS;

drop table ORDEN_COBRO;

/*==============================================================*/
/* Table: AUTO_PAGO                                             */
/*==============================================================*/
create table AUTO_PAGO (
   ID_AUTO_PAGO         SERIAL not null,
   CODIGO_CATASTRAL     TEXT                 null,
   FECHA_INGRESO        TEXT                 null,
   constraint PK_AUTO_PAGO primary key (ID_AUTO_PAGO)
);

/*==============================================================*/
/* Table: ORDENES_COBROS                                        */
/*==============================================================*/
create table ORDENES_COBROS (
   ID_ORDENES           SERIAL not null,
   CODIGO_CATASTRAL     TEXT                 null,
   FECHA_INGRESO        TEXT                 null,
   FECHA_VENCIMIENTO    TEXT                 null,
   constraint PK_ORDENES_COBROS primary key (ID_ORDENES)
);

/*==============================================================*/
/* Table: ORDEN_COBRO                                           */
/*==============================================================*/
create table ORDEN_COBRO (
   ID_ORDEN             SERIAL not null,
   CODIGO_CATASTRAL     TEXT                 not null,
   NOMBRES              TEXT                 null,
   ESTADO               TEXT                 null,
   VALOR                TEXT                 null,
   ANO                  TEXT                 null,
   DIRECCION            TEXT                 null,
   constraint PK_ORDEN_COBRO primary key (CODIGO_CATASTRAL)
);

alter table AUTO_PAGO
   add constraint FK_AUTO_PAG_REFERENCE_ORDEN_CO foreign key (CODIGO_CATASTRAL)
      references ORDEN_COBRO (CODIGO_CATASTRAL)
      on delete restrict on update restrict;

alter table ORDENES_COBROS
   add constraint FK_ORDENES__REFERENCE_ORDEN_CO foreign key (CODIGO_CATASTRAL)
      references ORDEN_COBRO (CODIGO_CATASTRAL)
      on delete restrict on update restrict;
