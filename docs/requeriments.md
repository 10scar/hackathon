CANOPY: Requerimientos Funcionales y Sistema (Demo Hackathon)

Este documento define la arquitectura de datos y los requerimientos funcionales mínimos para la versión de demostración de Canopy, diseñada específicamente para un entorno de Hackathon.

La prioridad es la narrativa del producto, la velocidad de demostración y la integración real con IA (Claude), simulando inteligentemente las integraciones pesadas de backend.

1. Modelo de Base de Datos (Esquema Conceptual)

Dado que es un demo construido sobre Next.js y Supabase, el modelo está estructurado relacionalmente para demostrar solidez en vivo. Está optimizado para soportar la inyección de datos de prueba (seeding) por cada inquilino (tenant/usuario) que se registre.

Entidades Principales

Empresa (Tenant / Tu Cliente)

id: UUID

nombre: String

industria: String (ej. SaaS, E-commerce)

tier: Enum (Enterprise, Mid-Market, SMB)

Usuario (Equipo interno de la Empresa)

id: UUID

empresa_id: UUID (FK)

nombre: String

rol: Enum (CS Rep, CS Manager, AE, VP)

email: String

Cliente (Cuenta monitoreada por Canopy)

id: UUID

empresa_id: UUID (FK)

nombre: String

mrr: Decimal (Ingreso Recurrente Mensual)

etapa_ciclo: Enum (Onboarding, Adopción, Renovación)

dias_para_renovacion: Integer

Health_Score (Registro evolutivo de la salud)

id: UUID

cliente_id: UUID (FK)

fecha_registro: Timestamp (Default: now())

score: Integer (0-100)

estado_salud: Enum (Verde, Amarillo, Rojo, Crítico)

factores_clave: JSON (Opcional, para guardar detalles que justifican el score en esa fecha)

Contacto (Mapa de stakeholders del Cliente)

id: UUID

cliente_id: UUID (FK)

nombre: String

rol_cuenta: Enum (Campeón, Comprador Económico, Usuario Regular)

estado_actual: Enum (Activo, No Responde, Cambió de Empresa)

dias_sin_login: Integer

Señal (Eventos detectados)

id: UUID

cliente_id: UUID (FK)

fecha_creacion: Timestamp (Default: now())

tipo: Enum (Uso, Soporte, Facturación, Comercial)

descripcion: String

es_critica: Boolean

Alerta_Intervencion (Acciones generadas por Canopy)

id: UUID

cliente_id: UUID (FK)

fecha_creacion: Timestamp (Default: now())

linea_deteccion: Enum (Línea 1 - Tendencia, Línea 2 - Crítica)

emocion_detectada: String

tipo_output: Enum (A-Reunión, B-Asíncrono, C-Producto)

mensaje_generado: Text (Generado por IA)

nota_interna: Text (Generado por IA)

estado: Enum (Pendiente, Aprobada, Editada, Descartada)

sla_vencimiento: Timestamp (Ej. +45 min para Línea 2)

asignado_a: UUID (FK -> Usuario)

2. Requerimientos por Componente

Componente 1: Clasificador y Generador de Alertas (Motor Lógico)

Este componente no usa IA generativa, se basa en reglas deterministas (If/Then) para ser ultrarrápido y predecible.

RF1.1 - Ingesta Simulada (Generación de Dummies en Supabase): Cada vez que un usuario se registre en la plataforma, el sistema debe ejecutar una función de inyección de datos (seeding) en Supabase. Esto creará automáticamente su entorno de demostración con 8 clientes preconfigurados narrativamente, inyectando también un set de datos históricos falsos en la tabla Historial_Health_Score para simular que el sistema ha estado monitoreando la cuenta por semanas.

RF1.2 - Ejecución a Demanda: Debe existir un botón oculto o específico para el demo ("Ejecutar Análisis") que dispare el motor de detección en tiempo real para leer los datos recién inyectados en Supabase, en lugar de usar cron jobs.

RF1.3 - Detección Línea 1 (Tendencias): El algoritmo debe consultar la tabla Historial_Health_Score (ordenada por fecha) y clasificar a un cliente en Línea 1 si su score más reciente cayó >10 puntos respecto a un registro de los últimos 7 días, o si el estado_salud entró en zona roja por primera vez en el historial.

RF1.4 - Detección Línea 2 (Eventos Críticos): El algoritmo debe clasificar en Línea 2 (Prioridad Máxima) basándose en triggers exactos en la tabla de Señales o Contactos:

Mención de cancelación/competencia.

Campeón inactivo > 10 días o cambió de empresa.

3+ señales críticas simultáneas.

Fallo de pago reciente.

RF1.5 - Motor de Health Score Estático: Calcular el score (0-100) basándose en pesos predefinidos, ajustado ligeramente por el tier del cliente. Al ejecutarse, debe insertar una nueva fila en la tabla Historial_Health_Score en lugar de sobreescribir datos, creando así la línea de tiempo.

Componente 2: Plataforma Web (Frontend Next.js)

La cara visible del producto. Debe verse premium, fluida y con la identidad visual de "Germinación/Canopy".

RF2.1 - Registro Web y Onboarding: La plataforma debe contar con una vista o página de registro (Sign Up). Al enviar este formulario, se autentica la sesión, se crea la cuenta de empresa/usuario y se dispara automáticamente el proceso descrito en RF1.1 (inyección de dummies), redirigiendo al usuario a un dashboard ya configurado para hacer la demo al instante.

RF2.2 - Dashboard de Vistas Duales:

Vista Gerencial: Tarjetas de métricas globales (MRR en riesgo, clientes críticos, horas ahorradas estimadas).

Vista Operativa (CS Rep): Lista de clientes extraída de Supabase. El frontend debe consultar el registro más reciente en Historial_Health_Score para cada cliente y ordenarlos por urgencia.

RF2.3 - Diferenciación Visual de Alertas: Los clientes marcados por la "Línea 2" deben tener un distintivo visual claro, urgente y predominante frente a los de la Línea 1.

RF2.4 - Interfaz "Human in the Loop": Para cada alerta, mostrar una tarjeta con:

Resumen del riesgo.

Mensaje propuesto (editable).

Botones de acción: Aprobar y Enviar, Editar, Descartar.

RF2.5 - Temporizador SLA (Crítico para el Demo): Las alertas de Línea 2 deben mostrar un contador regresivo visible y en movimiento (ej. 45:00 minutos restantes) para generar sentido de urgencia en el demo. El cálculo debe usar fecha_creacion y sla_vencimiento.

RF2.6 - Routing Visual: Mostrar claramente a quién fue asignada la alerta (Ej: "Asignado a: CS Rep" o "Escalado a: Account Executive").

RF2.7 - Persistencia en Supabase y Reset de Demo: Las acciones (Aprobar/Descartar) deben hacer un UPDATE en la tabla correspondiente de Supabase, moviendo la alerta del estado "Pendiente" a "Aprobada/Descartada". Debe existir un botón de "Reset Demo" en la configuración o el footer que elimine las tablas de la cuenta del usuario activo y vuelva a ejecutar la inyección de los datos dummies originales, dejando todo listo para una nueva presentación.

Componente 3: Agente IA (Toma de Decisiones y Respuestas)

El corazón inteligente. Es la única integración real (API de Claude) y el núcleo del "efecto wow".

RF3.1 - Prompt de Contexto Emocional: El sistema debe enviar la información del cliente consultada en Supabase (incluyendo su tendencia extraída de Historial_Health_Score y las fechas de las últimas Señales) hacia la API de Claude mediante un prompt fuertemente parametrizado.

RF3.2 - Estructuración de Respuesta (JSON): Claude debe devolver obligatoriamente un JSON con:

emocion_dominante (ej. Frustración, Ansiedad).

tipo_output (A, B o C).

mensaje_personalizado (Máximo 5 líneas, empático, sin revelar que el sistema lo "espía").

nota_interna (Contexto para el CS Rep).

RF3.3 - Inyección de Smart Scheduling (Capa 4): Si la IA determina que el tipo_output es "A" (Reunión requerida), el componente debe inyectar automáticamente un link estático (ej. Cal.com/Calendly) al final del mensaje generado.

RF3.4 - Generación de Briefing Pre-Reunión (Capa 7): Debe existir un botón "Ver Briefing" en clientes con reuniones agendadas. Al hacer clic, dispara una segunda llamada a Claude para generar:

Objetivo de la reunión.

Agenda sugerida.

Qué decir / Qué NO decir.

RF3.5 - Spinners de Carga Narrativos: Mientras se espera la respuesta de la API de Claude (6-10 segundos), la UI debe mostrar mensajes secuenciales (ej. *"Ingiriendo señales..." -> "Analizando contexto emocional..." -> "Generando recomendación...") para disimular la latencia y reforzar la arquitectura del producto.

3. Estrategia de Implementación para el Hackathon

Script de Dummies Supabase (Día 1): Dedica tiempo a perfeccionar el archivo o función SQL/JS que inyectará los datos. Si el Cliente 5 de tu base de datos dummy tiene la historia correcta de "el campeón cambió de empresa", todo el flujo se demostrará sin esfuerzo en el frontend. Presta especial atención a cargar el Historial_Health_Score y las Señales con fechas pasadas lógicas.

Interfaz "Smoke & Mirrors" (Día 1-2): Construye la UI en Next.js usando Tailwind CSS con la guía de marca (Verdes corporativos, diseño limpio), conectando los estados de Supabase para que las interacciones se sientan "vivas".

Prompt Engineering (Día 2): El 80% del valor del demo está en la calidad de los correos que redacte Claude. Ajusta la temperatura a 0.3 o 0.4 para asegurar respuestas consistentes y empáticas en la presentación final.