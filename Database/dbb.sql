CREATE DATABASE crm_leads;
USE crm_leads;

-- Tabla de agentes
CREATE TABLE agentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

-- Tabla de tipo de gestión
CREATE TABLE tipo_gestion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_gestion VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de leads
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    numero_whatsapp VARCHAR(20) UNIQUE NOT NULL,
    conversacion TEXT,
    id_agente INT,
    id_tipo_gestion INT,
    FOREIGN KEY (id_agente) REFERENCES agentes(id) ON DELETE SET NULL,
    FOREIGN KEY (id_tipo_gestion) REFERENCES tipo_gestion(id) ON DELETE SET NULL
);