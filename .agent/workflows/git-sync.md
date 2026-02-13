---
description: Realizar una actualización importante y definitiva en el repositorio de GitHub
---

Este workflow automatiza la subida de cambios críticos al repositorio principal.

1. Asegúrate de que todos los archivos SaaS estén guardados.
2. Ejecuta los comandos de sincronización:

// turbo
3. Sincronizar con GitHub:
```powershell
git add .
git commit -m "feat: Actualización definitiva SaaS - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin main
```

4. Verifica en Vercel que el despliegue se ha iniciado automáticamente.
