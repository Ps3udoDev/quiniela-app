## ¿Qué es una Quiniela? (Y la regla de negocio oculta)

En el ámbito deportivo, una **quiniela** es un juego de azar y conocimiento donde los participantes pronostican los resultados de una serie de partidos.

El requerimiento de tu stakeholder tiene una regla de negocio muy clara:

* **Acierto exacto (Marcador):** 3 puntos (ej. pronosticó 2-1, quedó 2-1).
* **Acierto de tendencia (Ganador/Empate):** 1 punto (ej. pronosticó 1-0, quedó 3-1; no le pegó al marcador, pero sí a que ganaba el mismo equipo).

> ⚠️ **Validación importante sobre el requerimiento:**
> Te pidieron la *"primera ronda eliminatoria"* del Mundial (octavos de final) y mencionaron *"quien pegue quién ganó o empató"*. En rondas eliminatorias de la Copa del Mundo **no existen los empates definitivos**; si empatan en los 90 minutos, van a prórroga y penales hasta que alguien avance.
> **Tu primera validación con el stakeholder debe ser:** ¿Los pronósticos se toman con el resultado final de los 90 minutos reglamentarios (donde sí puede haber empate) o cuenta el equipo que clasifica a la siguiente ronda? Normalmente, en las quinielas se usa el resultado a los 90 minutos.

---

## Análisis de Escalabilidad: ¿Modular o Rápido?

Tu intuición es 100% correcta. Si diseñas la base de datos de forma genérica, este sistema te servirá para el Mundial, para la Liga Pro de Ecuador, la Champions League, o incluso para torneos de eSports o la NBA.

### 1. Datos estáticos vs. Datos dinámicos

Dices algo clave: *"Al ser de la Copa del Mundo, no son datos que se requiera cambiar, ¿o sí?"*.

* **Los resultados históricos** no cambian. Una vez que termina el partido, el dato es sella y se calculan los puntos.
* **Las llaves cambian:** En una ronda eliminatoria de Copa del Mundo, los equipos de los partidos de octavos dependen de quién pase en la fase de grupos. Si la quiniela es *solo* para la fase eliminatoria, necesitas que tu sistema permita actualizar dinámicamente quién es el "Equipo A" y el "Equipo B" a medida que se definan los cruces.

### 2. Visión de negocio (Tu propuesta de valor)

Si te limitas a meter los datos "en duro" (hardcoded) para este Mundial, el código muere en un mes. Si lo haces modular, creas un **motor de quinielas**.

---

## Estructura Sugerida de la Aplicación

Para lograr que sea modular y escalable a otros deportes o torneos locales, la arquitectura de datos debería desacoplar el "Torneo" del "Partido".

### Módulos Core del Backend:

* **Módulo de Torneos (Tournament Engine):**
Permite registrar un torneo (ej. "Mundial 2026", "Liga Local de Fútbol", "Torneo de Pádel"). Cada torneo tiene fases (Fase de grupos, Octavos, Cuartos).
* **Módulo de Encuentros (Match Engine):**
Registra los partidos asociados a una fase de un torneo, con campos como: `equipo_local`, `equipo_visitante`, `fecha_partido`, `goles_local`, `goles_visitante`, `estado` (Pendiente, En juego, Finalizado).
* **Módulo de Pronósticos (Prediction Engine):**
Guarda las predicciones de los usuarios vinculadas a un `match_id`.
* **Módulo de Puntuación y Leaderboard (Scoring Engine):**
Un servicio o función que se ejecuta cada vez que un partido cambia a estado `Finalizado`. Compara la predicción del usuario con el resultado real y aplica la lógica matemática:
* Si `pred_local == real_local` Y `pred_visitante == real_visitante` $\rightarrow$ **3 pts**
* Sino, si el signo de la diferencia es igual `sign(pred_local - pred_visitante) == sign(real_local - real_visitante)` $\rightarrow$ **1 pt**
* Sino $\rightarrow$ **0 pts**



---

## Opinión Técnica y Estrategia de Implementación

Para cumplir con el requerimiento de hacerlo **"muy rápido"** pero manteniendo las puertas abiertas a la **escalabilidad**, te sugiero una estrategia híbrida:

### ¿Conectar una API externa desde el día uno?

* **Pros:** Automatización total. Los resultados se actualizan solos, no tienes que meter los goles a mano.
* **Contras:** Consume tiempo de desarrollo (mapeo de datos, manejo de errores de la API, buscar proveedores gratuitos o de pago que sirvan para el Mundial y luego para ligas locales).
* **Mi recomendación:** Para el MVP "flash", crea un **panel de administrador básico** en tu back (o directo en base de datos si es para consumo interno) donde tú o el stakeholder actualicen los resultados de los partidos manualmente cuando terminen. Son pocos partidos en rondas eliminatorias. Esto te ahorra horas de integración de APIs externas en la primera entrega. Deja el servicio de partidos abstraído para que en el futuro solo reemplaces el "recolector manual" por un "recolector de API".

### El Stack ideal para velocidad y modularidad

* **Base de datos:** Una relacional como **PostgreSQL**. La estructura de torneos, partidos, usuarios y predicciones es puramente relacional. Las políticas de seguridad a nivel de fila (RLS) te pueden ahorrar lógica en el back para asegurar que un usuario no vea las predicciones de otro antes de que empiece el partido.
* **Backend:** Un framework con tipado fuerte y rápido de levantar (como **NestJS** o un backend ligero con Python/FastAPI) que te permita exponer los endpoints esenciales: `getPartidos Activos`, `postPronostico`, y `getLeaderboard`.
* **Frontend:** Una interfaz limpia, minimalista y ultra responsiva (enfocada en móviles, que es donde la gente revisa las quinielas en el bar o la oficina mientras ve el partido). Un dashboard rápido con componentes pulidos te dará el look profesional que enganchará a todos.

