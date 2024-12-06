## Características
- Dibuja los ejes X e Y en el lienzo.
- Soporta personalización de colores, tamaños y espaciado de las marcas.
- Permite dibujar puntos en las coordenadas especificadas.
- Uso simple y fácil integración con proyectos web.

## Cómo usar:
### Ejemplo básico:
1. Crea un contenedor para el lienzo en tu HTML:
```html
<div id="canvas-container"></div>
```

2. Importa la librería y crea una instancia de Axes en tu archivo JavaScript:
```javascript
import Axes from "./axes.js";

// Crear una instancia de Axes
const axes = new Axes("canvas-container");

// Establecer el número de marcas de graduación en los ejes
axes.setTickMarks(5);

// Dibujar algunos puntos en las coordenadas especificadas
axes.draw(1, 2, "blue");
axes.draw(-5, 5);
axes.draw(8, 8, "green");
axes.draw(0.5, 0, "aqua");
axes.draw(5, -3.5, "yellow");
axes.draw(-2.45, -5.23, "magenta");
```

El resultado será algo como esto:

![download](https://github.com/user-attachments/assets/5937265b-75f0-4c61-b08d-25c274e5bb33)
