{
  "design_system": {
    "brand": {
      "name": "Canopy",
      "version": "1.0",
      "description": "Agente inteligente de retención de clientes.",
      "philosophy": "Fusión entre empatía humana y eficiencia tecnológica. Metáfora de germinación y cuidado de plantas para representar crecimiento de ventas y salud del cliente.",
      "tone_of_voice": [
        "Proactivo",
        "Empático",
        "Preciso",
        "Orientado a Resultados"
      ],
      "visual_metaphor": [
        "Crecimiento financiero",
        "Protección (Canopy/Copa del árbol)",
        "Salud y prevención",
        "Germinación desde datos"
      ]
    },
    "logo_guidelines": {
      "concept": "Evolución de una metáfora estática a una representación dinámica de germinación y crecimiento.",
      "elements": {
        "growth_asymmetry": "Hoja pequeña (primer brote) y una más grande apuntando en diagonal ascendente (gráfica financiera).",
        "active_seed": "Punto de origen (Health Score) desde el cual brota la relación con el cliente.",
        "expansive_arch": "Línea protectora con apertura superior (romper límites de crecimiento).",
        "minimalism": "Uso estricto de geometría, líneas limpias y colores sólidos sin degradados (enfoque B2B)."
      }
    },
    "tokens": {
      "colors": {
        "primary": {
          "name": "Verde Profesional",
          "value": "#27AE60",
          "css_var": "--color-primary",
          "usage": "Botones CTA, elementos interactivos principales, estados de cuenta 'saludables'."
        },
        "secondary": {
          "name": "Teal Oscuro",
          "value": "#138D75",
          "css_var": "--color-secondary",
          "usage": "Tipografía del logo, encabezados (H1, H2), navegación, arcos de protección."
        },
        "surface": {
          "name": "Verde Superficie",
          "value": "#E8F5E9",
          "css_var": "--color-surface",
          "usage": "Fondos de componentes, hover states, alertas sutiles informativas."
        },
        "background": {
          "name": "Blanco Fondo",
          "value": "#FFFFFF",
          "css_var": "--color-background",
          "usage": "Fondo principal de la aplicación, interior de tarjetas (cards)."
        },
        "text_main": {
          "name": "Carbón Text",
          "value": "#202124",
          "css_var": "--color-text-main",
          "usage": "Texto de cuerpo general."
        },
        "text_muted": {
          "name": "Texto Atenuado",
          "value": "#5F6368",
          "css_var": "--color-text-muted",
          "usage": "Textos secundarios o de soporte."
        },
        "border": {
          "name": "Borde Estándar",
          "value": "#E2E8F0",
          "css_var": "--color-border",
          "usage": "Bordes de tarjetas y separadores."
        },
        "semantic": {
          "error": {
            "value": "#E53E3E",
            "css_var": "--color-error",
            "usage": "Riesgo de churn detectado."
          },
          "warning": {
            "value": "#DD6B20",
            "css_var": "--color-warning",
            "usage": "Atención requerida."
          }
        }
      },
      "typography": {
        "primary": {
          "role": "Headings y Elementos Prominentes",
          "family": "['Montserrat', 'sans-serif']",
          "weights": {
            "semibold": 600,
            "bold": 700
          },
          "usage": "Logotipo, títulos principales (H1, H2, H3), botones prominentes."
        },
        "secondary": {
          "role": "Body y Datos",
          "family": "['Google Sans', 'Roboto', 'sans-serif']",
          "weights": {
            "regular": 400,
            "medium": 500
          },
          "usage": "Dashboards, tablas de datos, cuerpos de texto, mensajes generados por IA."
        }
      }
    },
    "components": {
      "button": {
        "primary": {
          "background_color": "var(--color-primary)",
          "text_color": "var(--color-background)",
          "border_radius": "6px",
          "padding": "12px 24px",
          "font_family": "Montserrat",
          "font_weight": 600,
          "border": "none",
          "hover_state": {
            "background_color": "#1E8449"
          }
        }
      },
      "health_card": {
        "background_color": "var(--color-background)",
        "border": "1px solid var(--color-border)",
        "border_radius": "8px",
        "padding": "20px",
        "box_shadow": "0px 4px 12px rgba(19, 141, 117, 0.08)",
        "dynamic_border_left": "4px solid",
        "variants": {
          "healthy": {
            "border_left_color": "var(--color-primary)"
          },
          "risk": {
            "border_left_color": "var(--color-error)"
          }
        }
      }
    }
  }
}