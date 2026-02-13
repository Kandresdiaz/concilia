# Guía de Despliegue ConciliAI (SaaS) 🚀

Sigue estos pasos para subir tu aplicación a producción y conectar todas las piezas.

## 1. Preparar el Repositorio (Git)
Asegúrate de tener un repositorio en GitHub.
```bash
git init
git add .
git commit -m "Build: Estructura SaaS y Auth"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

## 2. Configurar Supabase (Base de Datos)
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard).
2. Entra en tu proyecto y busca la sección **SQL Editor**.
3. Abre un nuevo query y pega el contenido del archivo `supabase_schema.sql` que he creado para ti en el proyecto.
4. Presiona **Run**. Esto creará las tablas de `profiles`, `conciliations` y los triggers de seguridad.
5. Ve a **Authentication -> Providers** y habilita **Google**. Configura los IDs de cliente (puedes seguir la guía de Supabase).

## 3. Desplegar en Vercel
1. Conecta tu repositorio de GitHub en [Vercel](https://vercel.com).
2. En la sección de **Environment Variables**, añade todas las variables que están en el archivo `.env.example`. 
   > [!IMPORTANT]
   > No olvides la `SUPABASE_SERVICE_ROLE_KEY` para que los webhooks de Stripe puedan actualizar los perfiles.

## 4. Configurar Webhooks de Stripe
1. Ve al Dashboard de Stripe -> Developers -> Webhooks.
2. Añade un endpoint: `https://tu-app.vercel.app/api/stripe/webhook`.
3. Selecciona el evento: `checkout.session.completed`.
4. Copia el **Signing Secret** y ponlo en la variable `STRIPE_WEBHOOK_SECRET` en Vercel.

## 5. ¡Listo para Producción!
Una vez desplegado, tu landing page estará en el dominio principal y el dashboard estará protegido por contraseña/Google Auth.

> [!TIP]
> Si la base de datos "no sirve" en este momento, al ejecutar el `supabase_schema.sql` en un nuevo proyecto se reseteará todo y funcionará correctamente con la nueva lógica SaaS.
