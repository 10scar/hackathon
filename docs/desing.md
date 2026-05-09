{
  "design_system": {
    "name": "Canopy",
    "version": "2.1",
    "scope": "Sistema de diseño global del proyecto: producto (app autenticada), marketing, documentación interna y piezas derivadas. Las implementaciones concretas (p. ej. landing estática) deben mapear estos tokens y roles; no sustituyen el sistema.",
    "references": {
      "example_landing_css": "docs/landing.html"
    },
    "principles": [
      "Una sola paleta y dos familias tipográficas en todo el ecosistema para coherencia entre marketing y producto.",
      "Superficies claras (cream / white_warm) por defecto; ink para texto y para zonas de alto contraste (sidebars, footers, modales oscuros) cuando el contexto lo requiera.",
      "El verde de marca (moss / leaf) indica acción, identidad y estados positivos; rust y risk_accent reservan atención y riesgo sin mezclarlos con CTAs primarios.",
      "Espaciado generoso y jerarquía clara: display serif para impacto; sans para UI, datos y densidad.",
      "Movimiento discreto: easing unificado; animaciones cortas y con propósito (feedback, no distracción)."
    ],
    "brand": {
      "tagline": "Detecta. Entiende. Retiene.",
      "description": "Plataforma de retención que combina lectura de señales (comportamiento, comunicación, contexto del contrato) con apoyo accionable para equipos de éxito de cliente.",
      "philosophy": "Empatía con el cliente B2B y eficiencia operativa para quien lo atiende. Metáfora orgánica (crecimiento, señales tempranas, cuidado) como hilo narrativo opcional en copy e ilustración, no como obligación en cada pantalla.",
      "tone_of_voice": [
        "Claro y directo",
        "Empático con cliente y con el rep",
        "Orientado a señales y tiempo (anticipar, no solo reaccionar)",
        "Preciso con datos y claims"
      ],
      "visual_metaphor": [
        "Crecimiento y salud de la relación",
        "Señales antes del daño irreversible",
        "Soporte y copa / protección (marca)",
        "Tierra y raíz como ancla visual secundaria (ilustración, no UI densa)"
      ]
    },
    "logo_guidelines": {
      "concept": "Marca de dosel-hoja: copa superior, acentos en musgo/hoja, tallo en corteza cuando aplique. Wordmark en Cormorant Garamond medio, color moss sobre fondos claros.",
      "elements": {
        "canopy_shape": "Silueta simétrica tipo copa; rellenos moss con acentos leaf donde el diseño lo precise.",
        "stem": "Trazo vertical bark para anclar ilustraciones o logomark completo.",
        "wordmark": "Cormorant Garamond 500, letter-spacing ligeramente negativo, color moss (o cream/white_warm sobre fondo ink).",
        "minimalism": "Logotipo vectorial sin degradados. Fondos decorativos (marketing) pueden usar blur, blobs u opacidad sin alterar el trazo del logo."
      }
    },
    "semantic_mapping": {
      "description": "Uso de color por intención en tablas, health scores, alertas y gráficos.",
      "positive_ok": ["leaf", "moss"],
      "brand_action": "moss",
      "warning_attention": "rust",
      "critical_or_high_risk": "risk_accent (#E07050) y texto ink para lectura",
      "neutral_secondary": ["ink_60", "sand"],
      "surfaces": {
        "default_page": "cream",
        "raised_card": "white_warm",
        "inverted_bar": "ink"
      }
    },
    "tokens": {
      "colors": {
        "ink": {
          "name": "Tinta",
          "value": "#1C1A16",
          "css_var": "--ink",
          "usage": "Texto principal; barras, footers y superficies invertidas."
        },
        "ink_60": {
          "name": "Tinta 60%",
          "value": "rgba(28,26,22,0.6)",
          "css_var": "--ink-60",
          "usage": "Texto secundario, metadatos, placeholders legibles."
        },
        "ink_20": {
          "name": "Tinta 12%",
          "value": "rgba(28,26,22,0.12)",
          "css_var": "--ink-20",
          "usage": "Bordes, divisores, estados deshabilitados suaves."
        },
        "cream": {
          "name": "Crema",
          "value": "#F5F0E8",
          "css_var": "--cream",
          "usage": "Fondo de aplicación o página por defecto; texto claro sobre ink."
        },
        "cream_80": {
          "name": "Crema translúcida",
          "value": "rgba(245,240,232,0.8)",
          "css_var": "--cream-80",
          "usage": "Cabeceras fijas, drawers y overlays que respeten el tono cálido."
        },
        "sand": {
          "name": "Arena",
          "value": "#E8DFC9",
          "css_var": "--sand",
          "usage": "Renglones zebra, fondos de filas inactivas, acentos cálidos neutros."
        },
        "white_warm": {
          "name": "Blanco cálido",
          "value": "#FEFCF7",
          "css_var": "--white",
          "usage": "Tarjetas, modales, inputs sobre cream; texto sobre botones moss."
        },
        "moss": {
          "name": "Musgo",
          "value": "#3D5A3E",
          "css_var": "--moss",
          "usage": "CTA primario, enlaces de acción principal, iconografía de marca activa."
        },
        "moss_light": {
          "name": "Musgo claro",
          "value": "#5C7D5E",
          "css_var": "--moss-lt",
          "usage": "Hover/focus de primarios; variaciones de icono o gráfico."
        },
        "leaf": {
          "name": "Hoja",
          "value": "#7FAF5F",
          "css_var": "--leaf",
          "usage": "Éxito, tendencia positiva, badges de estado sano, puntos de datos a favor."
        },
        "leaf_light": {
          "name": "Hoja clara",
          "value": "#A8C97F",
          "css_var": "--leaf-lt",
          "usage": "Acentos sobre fondo oscuro; highlights en gráficos."
        },
        "rust": {
          "name": "Óxido",
          "value": "#C0522A",
          "css_var": "--rust",
          "usage": "Advertencia, riesgo medio, borde o fondo tenue de alertas."
        },
        "bark": {
          "name": "Corteza",
          "value": "#6B4C2A",
          "css_var": "--bark",
          "usage": "Ilustración, pictogramas orgánicos, líneas de soporte visual."
        },
        "bark_light": {
          "name": "Corteza translúcida",
          "value": "rgba(107,76,42,0.12)",
          "css_var": "--bark-lt",
          "usage": "Fondos de apoyo en módulos ilustrados o empty states."
        },
        "semantic": {
          "risk_accent": {
            "value": "#E07050",
            "usage": "Énfasis dentro de alertas de riesgo (texto o icono), no para botones primarios."
          }
        }
      },
      "motion": {
        "easing": {
          "name": "Salida suave",
          "value": "cubic-bezier(0.16, 1, 0.3, 1)",
          "css_var": "--easing",
          "usage": "Transiciones de layout, paneles, entrada de contenido."
        },
        "duration_hint_ms": {
          "fast": "150–200",
          "default": "250–300",
          "emphasis": "400–900 solo en marketing o onboarding puntual"
        }
      },
      "typography": {
        "display_serif": {
          "role": "Titulares de página, héroes, números destacados en dashboards livianos",
          "family": "['Cormorant Garamond', 'Georgia', 'serif']",
          "weights": {
            "light": 300,
            "regular": 400,
            "medium": 500,
            "semibold": 600
          },
          "usage": "H1–H3 en vistas con narrativa; KPIs grandes; itálicas de énfasis de marca (moss o leaf-lt según fondo)."
        },
        "ui_sans": {
          "role": "Interfaz, tablas, formularios, tooltips, botones",
          "family": "['DM Sans', 'system-ui', 'sans-serif']",
          "weights": {
            "light": 300,
            "regular": 400,
            "medium": 500
          },
          "usage": "Cuerpo, navegación, etiquetas en mayúsculas con letter-spacing moderado, datos densos."
        }
      },
      "layout": {
        "content_max_width_px": 1100,
        "wide_max_width_px": 1200,
        "page_padding_x": "4–5% o 24px mínimo en móvil",
        "radius": {
          "pill": "100px",
          "card": "12–20px según densidad",
          "control": "8–12px para inputs y chips rectangulares",
          "message": "16px con esquina de cola 4px si se usan burbujas de chat"
        },
        "elevation": {
          "card_shadow": "0 2px 24px rgba(28,26,22,0.06) a 0 2px 60px según jerarquía",
          "primary_button_shadow": "0 4px 20px rgba(61,90,62,0.25–0.35)"
        }
      }
    },
    "components": {
      "app_navigation": {
        "description": "Barra superior o shell del producto.",
        "light_variant": "Fondo cream_80 u opaco cream, borde ink_20, altura ~64–72px, blur opcional en scroll.",
        "actions": "CTA primario pill o botón compacto según densidad de la vista."
      },
      "button_primary": {
        "background_color": "var(--moss)",
        "text_color": "var(--white)",
        "border_radius": "100px",
        "padding": "12px 24px compacto; 14px 28px estándar",
        "font_family": "DM Sans",
        "font_weight": 500,
        "box_shadow": "ver tokens.layout.elevation.primary_button_shadow",
        "hover_state": {
          "background_color": "var(--moss-lt)",
          "transform": "translateY(-1px) opcional",
          "box_shadow": "incremento sutil"
        }
      },
      "button_secondary": {
        "description": "Acciones secundarias sin competir con el primario.",
        "style": "Borde 1px moss o ink_20, fondo transparente o white_warm, texto moss o ink."
      },
      "button_ghost": {
        "style": "Texto ink_60 con subrayado o sin borde; hover a ink.",
        "usage": "Enlaces de apoyo, 'cancelar', 'ver más' en flujos densos."
      },
      "card": {
        "default": {
          "background_color": "var(--white)",
          "border": "1px solid var(--ink-20)",
          "border_radius": "12px",
          "padding": "20–24px",
          "box_shadow": "tokens.layout.elevation.card_shadow"
        },
        "muted": {
          "background_color": "var(--cream)",
          "border": "1px solid var(--ink-20)"
        }
      },
      "health_card": {
        "description": "Tarjeta de cuenta o métrica de salud con estado.",
        "extends": "components.card.default",
        "border_left": "4px solid",
        "variants": {
          "healthy": {
            "border_left_color": "var(--leaf)"
          },
          "at_risk": {
            "border_left_color": "var(--rust)"
          },
          "critical": {
            "border_left_color": "#E07050",
            "note": "Mismo token que colors.semantic.risk_accent; exponer como --risk-accent en tema si aplica."
          }
        }
      },
      "badge_pill": {
        "description": "Etiquetas de estado, filtros y chips.",
        "border": "1px solid rgba(61,90,62,0.3)",
        "border_radius": "100px",
        "text_color": "var(--moss)",
        "background": "transparent",
        "hover_optional": "fondo moss, texto white_warm (solo si es interactivo)"
      },
      "callout": {
        "description": "Bloque de advertencia o mensaje clave sin ser toast.",
        "risk_variant": {
          "border": "1px solid rgba(192,82,42,0.3)",
          "background": "rgba(192,82,42,0.06)",
          "radius": "12px",
          "title_typography": "Display serif opcional para una línea de énfasis"
        }
      },
      "table_row": {
        "description": "Datos densos en producto.",
        "stripe": "sand muy suave o cream alternado",
        "hover": "cream o ink_20 de fondo",
        "text": "ui_sans regular; números alineados según convención de datos"
      },
      "message_bubble": {
        "description": "Patrón opcional para vista previa de conversación, inbox o marketing.",
        "inbound": {
          "background": "rgba(245,240,232,0.07) sobre ink, o cream sobre fondo claro según contexto",
          "border": "1px solid rgba(245,240,232,0.12) o ink_20",
          "radius": "4px 16px 16px 16px"
        },
        "outbound": {
          "background": "rgba(61,90,62,0.25–0.35)",
          "border": "1px solid rgba(127,175,95,0.2)",
          "radius": "16px 4px 16px 16px"
        }
      },
      "footer": {
        "description": "Pie global de sitio o app pública.",
        "background": "var(--ink)",
        "text_muted": "rgba(245,240,232,0.4)",
        "text_strong": "rgba(245,240,232,0.7)"
      }
    },
    "patterns": {
      "marketing": "Mayor uso de display serif, secciones full-bleed y motion largo están permitidos si no rompen tokens (colores, fuentes, easing). Ver references.example_landing_css.",
      "product_dense": "Priorizar ui_sans, cards y tablas; reservar serif para títulos de página y momentos de celebración o empty states.",
      "dark_surfaces": "Sobre ink, texto cream; acentos leaf-lt para labels y datos secundarios legibles."
    }
  }
}
