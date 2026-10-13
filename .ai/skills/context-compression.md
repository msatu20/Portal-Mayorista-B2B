# Skill: compresión de contexto

Usar cuando un archivo de `context/` supera ~150 líneas, o el change-log del mes supera ~300.

1. Quitar lo que ya se puede deducir del código (listas de archivos, firmas).
2. Convertir párrafos en viñetas de una línea; mover el detalle a `docs/` o a un ADR y enlazarlo.
3. En `Trabajo-Activo.md`: mover lo terminado a una línea de resumen ("Hecho: X, Y, Z — ver change-log 2026-10").
4. En el change-log: al cerrar el mes, agregar arriba un resumen de 5 a 10 líneas.
5. No borrar decisiones ni riesgos vigentes; solo resumirlos.
