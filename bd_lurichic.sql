
create database lurichichouse;
use  lurichichouse;

select * from cliente;

insert into cliente (nombre,edad,profesion) values ('jair',30,'');
insert into cliente (nombre,edad,profesion) values ('Bea',32,'ingeniero');
commit;


CREATE TABLE `lurichichouse`.`usuarios` (
  `codusuario` VARCHAR(10) NOT NULL,
  `correo` VARCHAR(45) NULL,
  `contrasena` INT NULL, 
  `nombre` VARCHAR(20) NULL,
  `apellido` VARCHAR(20) NULL,
  `idperfil` VARCHAR(5) NULL,
  PRIMARY KEY (`codusuario`));
  
  CREATE TABLE `lurichichouse`.`pagos` (
  `idoperacion` INT AUTO_INCREMENT NOT NULL,
  `categoria` VARCHAR(45) NULL,
  `tipopago` VARCHAR(45) NULL,
  `pagopersonal` VARCHAR(45) NULL,
  `servicio` VARCHAR(45) NULL,
  `monto` decimal(5,2) NULL,
  `comentarios` VARCHAR(50) NULL,
  `dia_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fechapagoreal` VARCHAR(10),
  `usu_registro` VARCHAR(10) NULL,
  PRIMARY KEY (`idoperacion`));
  
  Select * from `lurichichouse`.`pagos`;
drop table  `lurichichouse`.`pagos`;
  
insert into `lurichichouse`.`usuarios` (codusuario,correo,contrasena,nombre, apellido, idperfil) 
values ('C0001','jairxll06@gmail.com','123456', 'Jair', 'Lurita', 'P001');
commit;
insert into `lurichichouse`.`usuarios` (codusuario,correo,contrasena,nombre, apellido, idperfil) 
values ('C0002','beatrizchiclla@gmail.com','123456', 'Beatriz', 'Chiclla', 'P001');
commit;


SELECT * FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = 2024 AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = 11 ORDER BY  fechapagoreal DESC

CREATE TABLE `mercado` (
  `iditem` int AUTO_INCREMENT NOT NULL,
  `categoryitem` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nameitem` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `dateitem` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `statusitem` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `useritem` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
 PRIMARY KEY (`iditem`));

