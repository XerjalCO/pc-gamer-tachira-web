<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
## 5. Organización del Código
- **Modularidad:** Máximo 100 líneas por archivo. Si es más largo, divídelo en componentes.
- **Data-Driven:** Nunca escribas información de productos directamente en el JSX. Usa archivos de constantes en `/data`.
- **Comentarios:** Escribe comentarios en las funciones lógicas para explicar qué hacen (ej. "Calcula precio en Bs", "Filtra por marca").