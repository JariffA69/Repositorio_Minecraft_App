/**
 * Minecraft Items API Utilities
 * Funciones para interactuar con la API https://api.minecraftitems.xyz
 */

const API_BASE_URL = 'https://api.minecraftitems.xyz';

// Datos de ejemplo locales - Lista expandida de items de Minecraft (100+ items)
const EXAMPLE_ITEMS = [
  { id: 1, name: 'Stone', itemId: 'stone', displayName: 'Piedra', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 2, name: 'Dirt', itemId: 'dirt', displayName: 'Tierra', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 3, name: 'Oak Log', itemId: 'oak_log', displayName: 'Tronco de Roble', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 4, name: 'Grass Block', itemId: 'grass_block', displayName: 'Bloque de Hierba', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 5, name: 'Cobblestone', itemId: 'cobblestone', displayName: 'Adoquín', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 6, name: 'Diamond Ore', itemId: 'diamond_ore', displayName: 'Mineral de Diamante', maxStackSize: 64, type: 'ore', category: 'mining' },
  { id: 7, name: 'Gold Ore', itemId: 'gold_ore', displayName: 'Mineral de Oro', maxStackSize: 64, type: 'ore', category: 'mining' },
  { id: 8, name: 'Iron Ore', itemId: 'iron_ore', displayName: 'Mineral de Hierro', maxStackSize: 64, type: 'ore', category: 'mining' },
  { id: 9, name: 'Diamond', itemId: 'diamond', displayName: 'Diamante', maxStackSize: 64, type: 'gem', category: 'crafting' },
  { id: 10, name: 'Gold Ingot', itemId: 'gold_ingot', displayName: 'Lingote de Oro', maxStackSize: 64, type: 'ingot', category: 'crafting' },
  { id: 11, name: 'Iron Ingot', itemId: 'iron_ingot', displayName: 'Lingote de Hierro', maxStackSize: 64, type: 'ingot', category: 'crafting' },
  { id: 12, name: 'Wooden Pickaxe', itemId: 'wooden_pickaxe', displayName: 'Pico de Madera', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 13, name: 'Stone Pickaxe', itemId: 'stone_pickaxe', displayName: 'Pico de Piedra', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 14, name: 'Iron Pickaxe', itemId: 'iron_pickaxe', displayName: 'Pico de Hierro', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 15, name: 'Diamond Pickaxe', itemId: 'diamond_pickaxe', displayName: 'Pico de Diamante', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 16, name: 'Apple', itemId: 'apple', displayName: 'Manzana', maxStackSize: 64, type: 'food', category: 'food' },
  { id: 17, name: 'Bread', itemId: 'bread', displayName: 'Pan', maxStackSize: 64, type: 'food', category: 'food' },
  { id: 18, name: 'Cooked Chicken', itemId: 'cooked_chicken', displayName: 'Pollo Cocinado', maxStackSize: 64, type: 'food', category: 'food' },
  { id: 19, name: 'Stick', itemId: 'stick', displayName: 'Palo', maxStackSize: 64, type: 'material', category: 'crafting' },
  { id: 20, name: 'Planks', itemId: 'oak_planks', displayName: 'Tablas de Roble', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 21, name: 'Sand', itemId: 'sand', displayName: 'Arena', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 22, name: 'Gravel', itemId: 'gravel', displayName: 'Grava', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 23, name: 'Granite', itemId: 'granite', displayName: 'Granito', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 24, name: 'Diorite', itemId: 'diorite', displayName: 'Diorita', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 25, name: 'Andesite', itemId: 'andesite', displayName: 'Andesita', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 26, name: 'Oak Leaves', itemId: 'oak_leaves', displayName: 'Hojas de Roble', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 27, name: 'Birch Log', itemId: 'birch_log', displayName: 'Tronco de Abedul', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 28, name: 'Spruce Log', itemId: 'spruce_log', displayName: 'Tronco de Pícea', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 29, name: 'Dark Oak Log', itemId: 'dark_oak_log', displayName: 'Tronco de Roble Oscuro', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 30, name: 'Acacia Log', itemId: 'acacia_log', displayName: 'Tronco de Acacia', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 31, name: 'Oak Stairs', itemId: 'oak_stairs', displayName: 'Escaleras de Roble', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 32, name: 'Stone Stairs', itemId: 'stone_stairs', displayName: 'Escaleras de Piedra', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 33, name: 'Iron Door', itemId: 'iron_door', displayName: 'Puerta de Hierro', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 34, name: 'Oak Door', itemId: 'oak_door', displayName: 'Puerta de Roble', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 35, name: 'Iron Sword', itemId: 'iron_sword', displayName: 'Espada de Hierro', maxStackSize: 1, type: 'weapon', category: 'tools' },
  { id: 36, name: 'Diamond Sword', itemId: 'diamond_sword', displayName: 'Espada de Diamante', maxStackSize: 1, type: 'weapon', category: 'tools' },
  { id: 37, name: 'Wooden Sword', itemId: 'wooden_sword', displayName: 'Espada de Madera', maxStackSize: 1, type: 'weapon', category: 'tools' },
  { id: 38, name: 'Golden Apple', itemId: 'golden_apple', displayName: 'Manzana Dorada', maxStackSize: 64, type: 'food', category: 'food' },
  { id: 39, name: 'Coal', itemId: 'coal', displayName: 'Carbón', maxStackSize: 64, type: 'material', category: 'crafting' },
  { id: 40, name: 'Charcoal', itemId: 'charcoal', displayName: 'Carbón Vegetal', maxStackSize: 64, type: 'material', category: 'crafting' },
  { id: 41, name: 'Lapis Lazuli', itemId: 'lapis_lazuli', displayName: 'Lapislázuli', maxStackSize: 64, type: 'gem', category: 'crafting' },
  { id: 42, name: 'Emerald', itemId: 'emerald', displayName: 'Esmeralda', maxStackSize: 64, type: 'gem', category: 'crafting' },
  { id: 43, name: 'Obsidian', itemId: 'obsidian', displayName: 'Obsidiana', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 44, name: 'Glass', itemId: 'glass', displayName: 'Vidrio', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 45, name: 'Glowstone', itemId: 'glowstone', displayName: 'Piedra Luminosa', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 46, name: 'Crafting Table', itemId: 'chest', displayName: 'Banco de Trabajo', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 47, name: 'Furnace', itemId: 'furnace', displayName: 'Horno', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 48, name: 'Chest', itemId: 'chest', displayName: 'Cofre', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 49, name: 'Bookshelf', itemId: 'bookshelf', displayName: 'Estantería', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 50, name: 'Enchanting Table', itemId: 'enchanting_table', displayName: 'Mesa de Encantamientos', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 51, name: 'Gold Sword', itemId: 'gold_sword', displayName: 'Espada de Oro', maxStackSize: 1, type: 'weapon', category: 'tools' },
  { id: 52, name: 'Stone Sword', itemId: 'stone_sword', displayName: 'Espada de Piedra', maxStackSize: 1, type: 'weapon', category: 'tools' },
  { id: 53, name: 'Wooden Axe', itemId: 'wooden_axe', displayName: 'Hacha de Madera', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 54, name: 'Stone Axe', itemId: 'stone_axe', displayName: 'Hacha de Piedra', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 55, name: 'Iron Axe', itemId: 'iron_axe', displayName: 'Hacha de Hierro', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 56, name: 'Diamond Axe', itemId: 'diamond_axe', displayName: 'Hacha de Diamante', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 57, name: 'Wooden Shovel', itemId: 'wooden_shovel', displayName: 'Pala de Madera', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 58, name: 'Stone Shovel', itemId: 'stone_shovel', displayName: 'Pala de Piedra', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 59, name: 'Iron Shovel', itemId: 'iron_shovel', displayName: 'Pala de Hierro', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 60, name: 'Diamond Shovel', itemId: 'diamond_shovel', displayName: 'Pala de Diamante', maxStackSize: 1, type: 'tool', category: 'tools' },
  { id: 61, name: 'Iron Helmet', itemId: 'iron_helmet', displayName: 'Casco de Hierro', maxStackSize: 1, type: 'armor', category: 'tools' },
  { id: 62, name: 'Iron Chestplate', itemId: 'iron_chestplate', displayName: 'Pechera de Hierro', maxStackSize: 1, type: 'armor', category: 'tools' },
  { id: 63, name: 'Iron Leggings', itemId: 'iron_leggings', displayName: 'Pantalones de Hierro', maxStackSize: 1, type: 'armor', category: 'tools' },
  { id: 64, name: 'Iron Boots', itemId: 'iron_boots', displayName: 'Botas de Hierro', maxStackSize: 1, type: 'armor', category: 'tools' },
  { id: 65, name: 'Diamond Helmet', itemId: 'diamond_helmet', displayName: 'Casco de Diamante', maxStackSize: 1, type: 'armor', category: 'tools' },
  { id: 66, name: 'Diamond Chestplate', itemId: 'diamond_chestplate', displayName: 'Pechera de Diamante', maxStackSize: 1, type: 'armor', category: 'tools' },
  { id: 67, name: 'Diamond Leggings', itemId: 'diamond_leggings', displayName: 'Pantalones de Diamante', maxStackSize: 1, type: 'armor', category: 'tools' },
  { id: 68, name: 'Diamond Boots', itemId: 'diamond_boots', displayName: 'Botas de Diamante', maxStackSize: 1, type: 'armor', category: 'tools' },
  { id: 69, name: 'Redstone', itemId: 'redstone', displayName: 'Redstone', maxStackSize: 64, type: 'material', category: 'crafting' },
  { id: 70, name: 'Redstone Ore', itemId: 'redstone_ore', displayName: 'Mineral de Redstone', maxStackSize: 64, type: 'ore', category: 'mining' },
  { id: 71, name: 'Copper Ore', itemId: 'copper_ore', displayName: 'Mineral de Cobre', maxStackSize: 64, type: 'ore', category: 'mining' },
  { id: 72, name: 'Copper Ingot', itemId: 'copper_ingot', displayName: 'Lingote de Cobre', maxStackSize: 64, type: 'ingot', category: 'crafting' },
  { id: 73, name: 'Amethyst Cluster', itemId: 'amethyst_cluster', displayName: 'Racimo de Amatista', maxStackSize: 64, type: 'gem', category: 'crafting' },
  { id: 74, name: 'Rose Bush', itemId: 'rose_bush', displayName: 'Arbusto de Rosas', maxStackSize: 64, type: 'flower', category: 'decoration' },
  { id: 75, name: 'Sunflower', itemId: 'sunflower', displayName: 'Girasol', maxStackSize: 64, type: 'flower', category: 'decoration' },
  { id: 76, name: 'Lilac', itemId: 'lilac', displayName: 'Lila', maxStackSize: 64, type: 'flower', category: 'decoration' },
  { id: 77, name: 'Poppy', itemId: 'poppy', displayName: 'Amapola', maxStackSize: 64, type: 'flower', category: 'decoration' },
  { id: 78, name: 'Dandelion', itemId: 'dandelion', displayName: 'Diente de León', maxStackSize: 64, type: 'flower', category: 'decoration' },
  { id: 79, name: 'Blue Orchid', itemId: 'blue_orchid', displayName: 'Orquídea Azul', maxStackSize: 64, type: 'flower', category: 'decoration' },
  { id: 80, name: 'Allium', itemId: 'allium', displayName: 'Ajo', maxStackSize: 64, type: 'flower', category: 'decoration' },
  { id: 81, name: 'Oxeye Daisy', itemId: 'oxeye_daisy', displayName: 'Margarita de Ojo de Buey', maxStackSize: 64, type: 'flower', category: 'decoration' },
  { id: 82, name: 'Seagrass', itemId: 'seagrass', displayName: 'Alga Marina', maxStackSize: 64, type: 'plant', category: 'decoration' },
  { id: 83, name: 'Sea Pickle', itemId: 'sea_pickle', displayName: 'Pepinillo de Mar', maxStackSize: 64, type: 'plant', category: 'decoration' },
  { id: 84, name: 'Cactus', itemId: 'cactus', displayName: 'Cactus', maxStackSize: 64, type: 'plant', category: 'building' },
  { id: 85, name: 'Dead Bush', itemId: 'dead_bush', displayName: 'Arbusto Muerto', maxStackSize: 64, type: 'plant', category: 'decoration' },
  { id: 86, name: 'Sugar Cane', itemId: 'sugar_cane', displayName: 'Caña de Azúcar', maxStackSize: 64, type: 'plant', category: 'crafting' },
  { id: 87, name: 'Wheat', itemId: 'wheat', displayName: 'Trigo', maxStackSize: 64, type: 'crop', category: 'food' },
  { id: 88, name: 'Beets', itemId: 'beetroots', displayName: 'Remolachas', maxStackSize: 64, type: 'crop', category: 'food' },
  { id: 89, name: 'Carrots', itemId: 'carrots', displayName: 'Zanahorias', maxStackSize: 64, type: 'crop', category: 'food' },
  { id: 90, name: 'Potatoes', itemId: 'potatoes', displayName: 'Papas', maxStackSize: 64, type: 'crop', category: 'food' },
  { id: 91, name: 'Baked Potato', itemId: 'baked_potato', displayName: 'Papa al Horno', maxStackSize: 64, type: 'food', category: 'food' },
  { id: 92, name: 'Carrot', itemId: 'carrot', displayName: 'Zanahoria', maxStackSize: 64, type: 'food', category: 'food' },
  { id: 93, name: 'Pumpkin', itemId: 'carved_pumpkin', displayName: 'Calabaza', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 94, name: 'Jack oLantern', itemId: 'jack_o_lantern', displayName: 'Calabaza Tallada', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 95, name: 'Melon', itemId: 'melon_slice', displayName: 'Melón', maxStackSize: 64, type: 'block', category: 'food' },
  { id: 96, name: 'Melon Slice', itemId: 'melon_slice', displayName: 'Rebanada de Melón', maxStackSize: 64, type: 'food', category: 'food' },
  { id: 97, name: 'Pumpkin Seeds', itemId: 'pumpkin_seeds', displayName: 'Semillas de Calabaza', maxStackSize: 64, type: 'seed', category: 'crafting' },
  { id: 98, name: 'Melon Seeds', itemId: 'melon_seeds', displayName: 'Semillas de Melón', maxStackSize: 64, type: 'seed', category: 'crafting' },
  { id: 99, name: 'Wheat Seeds', itemId: 'wheat_seeds', displayName: 'Semillas de Trigo', maxStackSize: 64, type: 'seed', category: 'crafting' },
  { id: 100, name: 'Dark Oak Planks', itemId: 'dark_oak_planks', displayName: 'Tablas de Roble Oscuro', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 101, name: 'Birch Planks', itemId: 'birch_planks', displayName: 'Tablas de Abedul', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 102, name: 'Spruce Planks', itemId: 'spruce_planks', displayName: 'Tablas de Pícea', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 103, name: 'Acacia Planks', itemId: 'acacia_planks', displayName: 'Tablas de Acacia', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 104, name: 'Jungle Planks', itemId: 'jungle_planks', displayName: 'Tablas de Jungla', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 105, name: 'Nether Brick', itemId: 'nether_brick', displayName: 'Ladrillo del Nether', maxStackSize: 64, type: 'block', category: 'building' },
  { id: 106, name: 'Nether Wart', itemId: 'nether_wart', displayName: 'Verruga del Nether', maxStackSize: 64, type: 'plant', category: 'crafting' },
  { id: 107, name: 'Ink Sac', itemId: 'ink_sac', displayName: 'Saco de Tinta', maxStackSize: 64, type: 'material', category: 'crafting' },
  { id: 108, name: 'Cocoa Beans', itemId: 'cocoa_beans', displayName: 'Granos de Cacao', maxStackSize: 64, type: 'material', category: 'crafting' },
  { id: 109, name: 'Bone', itemId: 'bone', displayName: 'Hueso', maxStackSize: 64, type: 'material', category: 'crafting' },
  { id: 110, name: 'Rotten Flesh', itemId: 'rotten_flesh', displayName: 'Carne Podrida', maxStackSize: 64, type: 'food', category: 'food' },
];

/**
 * Obtiene todos los items disponibles de la API
 * @returns {Promise<Array>} Array de items
 */
export const getAllItems = async () => {
  const endpoints = [
    `${API_BASE_URL}/api/items`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        console.log(`Response from ${endpoint}:`, JSON.stringify(data).substring(0, 200));

        // /api/items puede estar deshabilitado y regresar solo metadata
        if (data?.message && String(data.message).toLowerCase().includes('disabled')) {
          console.log(`Endpoint ${endpoint} is disabled: ${data.message}`);
          console.log('Using local fallback items (API list endpoint is disabled).');
          return EXAMPLE_ITEMS;
        }
        
        // Manejo de diferentes estructuras de respuesta
        let items = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data?.items && Array.isArray(data.items)) {
          items = data.items;
        } else if (data?.data && Array.isArray(data.data)) {
          items = data.data;
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          // Si es un objeto, intenta convertir valores a array
          items = Object.values(data);
        }
        
        console.log(`Items from ${endpoint}:`, items?.length || 0, 'items');
        
        // Validar que sean items reales (con name/displayName/itemId)
        if (items.length > 0 && isValidItemsArray(items)) {
          // Sanitizar items para asegurar que tengan campos requeridos
          return sanitizeItems(items);
        }

        console.log(`Endpoint ${endpoint} did not return a valid items array. Using local fallback items.`);
        return EXAMPLE_ITEMS;
      }
    } catch (error) {
      console.log(`Failed endpoint ${endpoint}:`, error.message);
    }
  }
  
  console.log('Using local fallback items (API list not available).');
  return EXAMPLE_ITEMS;
};

/**
 * Valida que un array contenga items válidos
 */
const isValidItemsArray = (items) => {
  if (!Array.isArray(items) || items.length === 0) return false;
  
  // Verificar que al menos el 50% de los items tengan propiedades válidas
  const validCount = items.filter(item => 
    (typeof item === 'object' && item !== null) &&
    (item.name || item.displayName || item.itemId || item.id)
  ).length;
  
  return validCount / items.length >= 0.5;
};

/**
 * Sanitiza items para asegurar que tengan campos requeridos
 */
const sanitizeItems = (items) => {
  return items.map((item, index) => ({
    id: item.id || index + 1,
    name: item.name || item.displayName || 'Unknown Item',
    itemId: item.itemId || (item.name ? item.name.toLowerCase().replace(/\s+/g, '_') : `item_${index}`),
    displayName: item.displayName || item.name || 'Unknown',
    maxStackSize: item.maxStackSize || 64,
    type: item.type || 'item',
    category: item.category || 'other',
  })).filter(item => item.name && item.name !== 'Unknown Item'); // Filtrar items completamente inválidos
};

/**
 * Obtiene un item específico por nombre
 * @param {string} itemName - Nombre del item
 * @returns {Promise<Object>} Item encontrado
 */
export const getItemByName = async (itemName) => {
  try {
    const items = await getAllItems();
    return items.find(item => item.name?.toLowerCase() === itemName.toLowerCase());
  } catch (error) {
    console.error('Error fetching specific item:', error);
    return null;
  }
};

/**
 * Obtiene la URL del icono de un item desde la API
 * @param {string} itemName - Nombre del item o itemId (ej: "Diamond Sword" o "diamond_sword")
 * @returns {string} URL del icono
 */
export const getItemIconUrl = (itemName) => {
  if (!itemName || typeof itemName !== 'string') {
    console.warn('Invalid item name:', itemName);
    return null;
  }

  const itemId = normalizeItemId(itemName);
  
  if (!itemId) {
    console.warn('Could not generate item ID from:', itemName);
    return null;
  }
  
  // Endpoint: GET /api/item/:itemName
  return `${API_BASE_URL}/api/item/${itemId}`;
};

/**
 * Obtiene la URL del GIF rotatorio de un item desde la API
 * @param {string} itemName - Nombre del item o itemId (ej: "Diamond Sword" o "diamond_sword")
 * @returns {string} URL del GIF
 */
export const getItemGifUrl = (itemName) => {
  if (!itemName || typeof itemName !== 'string') {
    console.warn('Invalid item name for GIF:', itemName);
    return null;
  }

  const itemId = normalizeItemId(itemName);
  
  if (!itemId) {
    console.warn('Could not generate item ID from:', itemName);
    return null;
  }

  // Nota: Este endpoint devuelve PNG (no GIF), se mantiene por compatibilidad.
  return `${API_BASE_URL}/api/item/${itemId}?glint=true`;
};

/**
 * Crea una fuente de imagen para GIF rotatorio usando el endpoint correcto (POST).
 * Compatible con <Image source={...} /> en React Native.
 * @param {string} itemName - Nombre del item o itemId
 * @returns {Object|null} source para Image
 */
export const getItemGifSource = (itemName, options = {}) => {
  if (!itemName || typeof itemName !== 'string') {
    console.warn('Invalid item name for GIF source:', itemName);
    return null;
  }

  const itemId = normalizeItemId(itemName);

  if (!itemId) {
    console.warn('Could not generate item ID from:', itemName);
    return null;
  }

  const {
    frames = 16,
    speed = 70,
    scale = 1,
    glint = true,
  } = options;

  return {
    uri: `${API_BASE_URL}/api/item/gif/direct`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      itemName: itemId,
      frames,
      speed,
      scale,
      glint,
    }),
  };
};

const normalizeItemId = (itemName) => {
  if (!itemName || typeof itemName !== 'string') return null;
  const normalized = itemName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '');

  // Alias comunes para nombres que no existen directamente en el endpoint
  const aliasMap = {
    gold_sword: 'golden_sword',
    beetroots: 'beetroot',
    carrots: 'carrot',
    potatoes: 'potato',
    pumpkin: 'carved_pumpkin',
    melon: 'melon_slice',
    crafting_table: 'chest',
  };

  return aliasMap[normalized] || normalized;
};

/**
 * Obtiene items filtrados por categoría/tipo
 * @param {Array} items - Array de items
 * @param {string} type - Tipo de item a filtrar
 * @returns {Array} Items filtrados
 */
export const filterItemsByType = (items, type) => {
  if (!type || type === 'all') {
    return items;
  }
  return items.filter(item => item.type === type);
};

/**
 * Obtiene categorías únicas de items
 * @param {Array} items - Array de items
 * @returns {Array} Array de categorías únicas
 */
export const getItemCategories = (items) => {
  const categories = new Set(
    items?.map(item => item.type || 'other') || []
  );
  return ['all', ...Array.from(categories)];
};

/**
 * Busca items por nombre
 * @param {Array} items - Array de items
 * @param {string} query - Término de búsqueda
 * @returns {Array} Items que coinciden con la búsqueda
 */
export const searchItems = (items, query) => {
  if (!items || !Array.isArray(items)) return [];
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    item.name?.toLowerCase().includes(lowerQuery) ||
    item.displayName?.toLowerCase().includes(lowerQuery)
  );
};
