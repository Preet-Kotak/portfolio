/**
 * Isometric coordinate conversion utilities
 * 
 * These functions convert between grid coordinates (logical 2D grid)
 * and screen coordinates (isometric projected 2D view).
 */

/**
 * Isometric tile dimensions
 * These define the width and height of a single isometric tile in screen space
 */
export const TILE_WIDTH = 128;  // Width of isometric tile in pixels
export const TILE_HEIGHT = 64;  // Height of isometric tile in pixels

/**
 * Convert grid coordinates to isometric screen position
 * 
 * @param {number} gridX - Grid X coordinate (relative to center)
 * @param {number} gridY - Grid Y coordinate (relative to center)
 * @param {Object} gridInfo - Grid calibration info from VillageScene
 * @param {Object} gridInfo.center - Center point {x, y} of the grid in screen space
 * @param {number} gridInfo.tileWidth - Width of one tile in isometric view
 * @param {number} gridInfo.tileHeight - Height of one tile in isometric view
 * @returns {Object} Screen position {x, y}
 */
export function gridToScreen(gridX, gridY, gridInfo) {
  const { center, tileWidth, tileHeight } = gridInfo;
  
  // Isometric projection formula:
  // screenX = centerX + (gridX - gridY) * (tileWidth / 2)
  // screenY = centerY + (gridX + gridY) * (tileHeight / 2)
  return {
    x: center.x + (gridX - gridY) * (tileWidth / 2),
    y: center.y + (gridX + gridY) * (tileHeight / 2)
  };
}

/**
 * Convert screen coordinates to grid coordinates (inverse of gridToScreen)
 * 
 * @param {number} screenX - Screen X coordinate
 * @param {number} screenY - Screen Y coordinate
 * @param {Object} gridInfo - Grid calibration info from VillageScene
 * @param {Object} gridInfo.center - Center point {x, y} of the grid in screen space
 * @param {number} gridInfo.tileWidth - Width of one tile in isometric view
 * @param {number} gridInfo.tileHeight - Height of one tile in isometric view
 * @returns {Object} Grid position {x, y}
 */
export function screenToGrid(screenX, screenY, gridInfo) {
  const { center, tileWidth, tileHeight } = gridInfo;
  
  // Relative to center
  const relX = screenX - center.x;
  const relY = screenY - center.y;
  
  // Inverse isometric projection:
  // gridX = (relX / (tileWidth / 2) + relY / (tileHeight / 2)) / 2
  // gridY = (relY / (tileHeight / 2) - relX / (tileWidth / 2)) / 2
  const gridX = (relX / (tileWidth / 2) + relY / (tileHeight / 2)) / 2;
  const gridY = (relY / (tileHeight / 2) - relX / (tileWidth / 2)) / 2;
  
  return { x: gridX, y: gridY };
}

/**
 * Calculate depth value for isometric sorting
 * Objects further back (lower gridY) should render behind objects in front
 * 
 * @param {number} screenY - Screen Y coordinate of the object
 * @returns {number} Depth value for Phaser's depth sorting
 */
export function calculateDepth(screenY) {
  return screenY;
}

/**
 * Snap grid coordinates to nearest tile
 * Useful for building placement or grid-aligned interactions
 * 
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridY - Grid Y coordinate
 * @returns {Object} Snapped grid position {x, y}
 */
export function snapToGrid(gridX, gridY) {
  return {
    x: Math.round(gridX),
    y: Math.round(gridY)
  };
}
