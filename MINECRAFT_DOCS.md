# Minecraft Items Integration - Documentación

## 📋 Descripción General

Se ha integrado la API de Minecraft Items (https://api.minecraftitems.xyz) a la aplicación con tres nuevas pantallas principales.

## 🎮 Nuevas Pantallas

### 1. **Items** (MinecraftItems.js)
- **Icono:** Minecraft
- **Descripción:** Visualiza un listado de todos los items disponibles
- **Características:**
  - Buscar items por nombre
  - Ver información detallada de cada item al presionarlo
  - Información mostrada: ID, Display Name, Max Stack Size, Tipo, Versión
  - Interfaz con scrolling infinite

### 2. **Render** (MinecraftRender.js)
- **Icono:** Marcos de imagen
- **Descripción:** Visualiza los items en una grid con categorías
- **Características:**
  - Filtrado por categoría/tipo de item
  - Vista en grid de 2 columnas
  - Información de stack size para cada item
  - Tabs horizontales para cambiar categorías

### 3. **Inventario** (MinecraftInventory.js)
- **Icono:** Cofre
- **Descripción:** Gestiona inventarios estilo Minecraft
- **Características:**
  - Ver inventarios pre-cargados (Principal, Cofre 1, Cofre 2)
  - Crear nuevos inventarios personalizados
  - Definir nombre y número de slots
  - Visualización en grid de slots (16 slots por fila)
  - Ver detalles de inventario (slots libres, ocupados, items)
  - Eliminar inventarios

## 🏗️ Estructura del Proyecto

```
app/
├── Context/
│   └── MinecraftContext.js          # Contexto global para compartir items
├── Utils/
│   └── minecraftApi.js               # Funciones de utilidad para la API
└── screen/
    └── Minecraft/
        ├── MinecraftItems.js         # Pantalla de listado de items
        ├── MinecraftRender.js        # Pantalla de grid de items
        └── MinecraftInventory.js     # Pantalla de gestión de inventarios
```

## 🔧 Utilidades (minecraftApi.js)

Funciones disponibles para usar en otros componentes:

```javascript
// Obtener todos los items
getAllItems()

// Obtener un item específico por nombre
getItemByName(itemName)

// Obtener URL del icono de un item
getItemIconUrl(itemName)

// Filtrar items por tipo
filterItemsByType(items, type)

// Obtener categorías únicas
getItemCategories(items)

// Buscar items por nombre o displayName
searchItems(items, query)
```

## 📦 Context API (MinecraftContext.js)

El contexto gestiona la carga de items a nivel global, evitando múltiples llamadas a la API:

```javascript
const { items, loading, error } = useMinecraftItems();
```

**Propiedades:**
- `items`: Array de todos los items de Minecraft
- `loading`: Boolean indicando si se está cargando
- `error`: String con mensaje de error si ocurre alguno

## 🎨 Componentes de React Native Paper Utilizados

- **Card**: Para mostrar información de items e inventarios
- **Button**: Botones de acción
- **Dialog & Portal**: Diálogos modales para detalles
- **ActivityIndicator**: Indicador de carga
- **Searchbar**: Barra de búsqueda
- **Chip**: Chips para filtrar categorías
- **TextInput**: Inputs para crear inventarios
- **List.Item**: Items de lista para mostrar contenido

## 🔄 Navigation Tabs

Se agregaron 3 nuevos tabs al navegador inferior (ahora tienes 7 tabs en total):

1. Home
2. Reports
3. Settings
4. About
5. Calculadora
6. Meals
7. **Items** (Nuevo)
8. **Render** (Nuevo)
9. **Inventario** (Nuevo)

## 🚀 Cómo Usar

### Importar y usar el Context en un nuevo componente:

```javascript
import { useMinecraftItems } from '../../Context/MinecraftContext';

export default function MiComponente() {
  const { items, loading, error } = useMinecraftItems();
  
  // items contiene todos los items de Minecraft
  // ...
}
```

### Usar las funciones de utilidad:

```javascript
import { 
  searchItems, 
  filterItemsByType, 
  getItemCategories 
} from '../../utils/minecraftApi';

const resultados = searchItems(items, 'diamond');
const herramientas = filterItemsByType(items, 'tool');
const categorias = getItemCategories(items);
```

## 📊 Estructura de Datos de un Item

```javascript
{
  name: "diamond",
  id: 264,
  displayName: "Diamond",
  maxStackSize: 64,
  type: "material",
  version: "1.19"
}
```

## 💡 Mejoras Implementadas

- ✅ Sistema centralizado de Context para compartir items
- ✅ Utilidades reutilizables para la API
- ✅ Componentes optimizados con useMemo
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Interfaz intuitiva con React Native Paper
- ✅ Grid responsive para items
- ✅ Sistema de inventarios flexible

## 🔗 API Endpoint

**Base URL:** `https://api.minecraftitems.xyz`

**Endpoint utilizado:**
- `GET /all_items` - Obtiene todos los items disponibles

## 📝 Notas

- La API carga todos los items la primera vez en el Context
- Los items se cachean en memoria durante la sesión
- El grid de Render muestra 2 columnas
- El grid de Inventario muestra 5 slots por fila
- Cada inventario puede tener un máximo de 64 slots

## 🎯 Próximas Mejoras Sugeridas

- Agregar imágenes reales de items
- Sistema de drag & drop para mover items entre inventarios
- Persistencia de inventarios en AsyncStorage
- Búsqueda avanzada con filtros
- Estadísticas de items
- Exportar/importar inventarios
- Modo oscuro/claro
