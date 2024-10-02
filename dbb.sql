CREATE DATABASE crm_whatsapp;
USE crm_whatsapp;

-- Tabla de usuarios del CRM
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contactos de WhatsApp
CREATE TABLE contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    numero_telefono VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    direccion VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tipo de gestión
CREATE TABLE tipo_gestion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de conversaciones con almacenamiento en bloque y referencia a tipo de gestión
CREATE TABLE conversaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_contacto INT,
    id_usuario INT,
    contenido_conversacion TEXT NOT NULL,  -- Aquí se guarda toda la conversación en un solo campo
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_tipo_gestion INT,  -- Referencia al tipo de gestión
    FOREIGN KEY (id_contacto) REFERENCES contactos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_gestion) REFERENCES tipo_gestion(id) ON DELETE SET NULL
);