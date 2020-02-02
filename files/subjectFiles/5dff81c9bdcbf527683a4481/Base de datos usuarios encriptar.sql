DROP DATABASE IF EXISTS EjemploUsuariosEncriptados;
CREATE DATABASE EjemploUsuariosEncriptados;
USE EjemploUsuariosEncriptados;

create table usuarios
  (
    DNI char(10) not null,
    nombre char(40) not null,
    Apellidos char(40) not null,
    email char (40) not null,
    edad smallint,
    password char(255) not null,
    primary key(DNI)	
  );
  
  insert into usuarios values ('03936143S','Mario','Marugan','mariomarugan10@hotmail.com',25,'81dc9bdb52d04dc20036dbd8313ed055');