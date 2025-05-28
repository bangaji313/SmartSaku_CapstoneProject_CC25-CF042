/**
 * Enhanced Chart Animations for SmartSaku
 * Provides interactive chart elements with animations
 */

/**
 * Setup SVG Cash Flow Chart interactions
 */
export function setupCashFlowInteractions() {
  console.log('Setting up cash flow chart interactions...');
  
  // Add hover effects to chart legend items
  const legendItems = document.querySelectorAll('.chart-legend-item');
  if (!legendItems.length) return;

  legendItems.forEach(item => {
    const lineId = item.dataset.line;
    
    item.addEventListener('mouseenter', () => {
      // Highlight the corresponding line
      const line = document.getElementById(lineId);
      const area = document.getElementById(`${lineId.toLowerCase()}Area`);
      if (line) {
        line.setAttribute('stroke-width', '6');
        if (area) {
          area.setAttribute('opacity', '0.9');
        }
      }
      
      // Other lines fade
      legendItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherId = otherItem.dataset.line;
          const otherLine = document.getElementById(otherId);
          const otherArea = document.getElementById(`${otherId.toLowerCase()}Area`);
          
          if (otherLine) {
            otherLine.setAttribute('stroke-opacity', '0.3');
            if (otherArea) {
              otherArea.setAttribute('opacity', '0.2');
            }
          }
        }
      });
    });
    
    item.addEventListener('mouseleave', () => {
      // Reset all lines
      document.querySelectorAll('#GRAPHS polyline').forEach(line => {
        line.setAttribute('stroke-width', '4');
        line.setAttribute('stroke-opacity', '1');
      });
      
      document.querySelectorAll('#GRAPHS path').forEach(area => {
        area.setAttribute('opacity', '0.7');
      });
    });
  });
}

/**
 * Initialize number counters with animation
 */
export function setupCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    if (isNaN(target)) return;
    
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    
    let current = 0;
    const increment = target / 100;
    const duration = 1500;
    const interval = duration / 100;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        const formattedValue = target >= 1000 ? 
          (target/1000).toLocaleString() : 
          target.toLocaleString();
        counter.textContent = `${prefix}${formattedValue}${suffix}`;
        clearInterval(timer);
      } else {
        const formattedValue = current >= 1000 ? 
          Math.floor(current/1000).toLocaleString() : 
          Math.floor(current).toLocaleString();
        counter.textContent = `${prefix}${formattedValue}${suffix}`;
      }
    }, interval);
  });
}

/**
 * Initialize all chart animations
 */
export function initChartAnimations() {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing chart animations...');
    
    // Setup chart interactions
    setupCashFlowInteractions();
    
    // Setup counter animations
    setupCounterAnimations();
  });
}

// Auto-initialize
initChartAnimations();