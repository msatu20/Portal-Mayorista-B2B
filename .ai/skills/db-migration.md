# Skill: migración de base de datos

1. Editar `schema.prisma`; nombrar la migración en inglés y en imperativo (`add_pricing_rules`).
2. `prisma migrate dev` en local; revisar el SQL generado.
3. Migraciones destructivas (drop, rename, cambio de tipo): hacerlas en 2 pasos (agregar → migrar datos → quitar)
   y pedir confirmación al usuario.
4. Actualizar los seeds si corresponde.
5. Registrar en change-log y, si cambió el modelo, en `context/Arquitectura-Resumen.md`.
