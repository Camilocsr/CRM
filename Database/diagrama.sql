// Usa DBML para definir la estructura de tu base de datos
// Docs: https://dbml.dbdiagram.io/docs

Table agentes {
    id integer [primary key, increment]
    nombre varchar
    correo varchar [unique]
    contrasena varchar
}

Table tipo_gestion {
    id integer [primary key, increment]
    tipo_gestion varchar [unique]
}

Table leads {
    id integer [primary key, increment]
    nombre varchar
    numero_whatsapp varchar [unique]
    conversacion text
    id_agente integer [ref: > agentes.id]
    id_tipo_gestion integer [ref: > tipo_gestion.id]
}