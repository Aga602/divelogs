// Global variables
let canvas;
let ctx;
let dives = [];
let hoveredDive = null;

// API Base URL
const API_BASE = window.location.origin;

// Map projection constants
const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadDives();
    loadStats();
    setupModal();
});

// Initialize the canvas map
function initMap() {
    canvas = document.getElementById('map');
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = MAP_WIDTH;
    canvas.height = MAP_HEIGHT;
    
    // Draw initial map
    drawMap();
    
    // Add mouse event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMapClick);
}

// Draw the world map background
function drawMap() {
    // Clear canvas
    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    
    // Draw ocean background
    ctx.fillStyle = '#d4e8f7';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    
    // Draw simple continents (simplified world map)
    ctx.fillStyle = '#a8d5ba';
    ctx.strokeStyle = '#6b9e7f';
    ctx.lineWidth = 1;
    
    // Draw simplified continents
    drawContinents();
    
    // Draw grid lines
    drawGrid();
}

// Draw simplified continents
function drawContinents() {
    // North America
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(150, 80);
    ctx.lineTo(200, 100);
    ctx.lineTo(250, 150);
    ctx.lineTo(230, 200);
    ctx.lineTo(180, 250);
    ctx.lineTo(120, 230);
    ctx.lineTo(80, 180);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // South America
    ctx.beginPath();
    ctx.moveTo(200, 280);
    ctx.lineTo(230, 260);
    ctx.lineTo(240, 300);
    ctx.lineTo(250, 380);
    ctx.lineTo(230, 420);
    ctx.lineTo(210, 430);
    ctx.lineTo(190, 410);
    ctx.lineTo(180, 350);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Europe
    ctx.beginPath();
    ctx.moveTo(380, 120);
    ctx.lineTo(420, 110);
    ctx.lineTo(450, 130);
    ctx.lineTo(460, 160);
    ctx.lineTo(440, 180);
    ctx.lineTo(400, 170);
    ctx.lineTo(370, 150);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Africa
    ctx.beginPath();
    ctx.moveTo(400, 200);
    ctx.lineTo(450, 190);
    ctx.lineTo(490, 220);
    ctx.lineTo(500, 280);
    ctx.lineTo(480, 350);
    ctx.lineTo(450, 380);
    ctx.lineTo(420, 390);
    ctx.lineTo(390, 360);
    ctx.lineTo(380, 280);
    ctx.lineTo(390, 220);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Asia
    ctx.beginPath();
    ctx.moveTo(480, 100);
    ctx.lineTo(550, 90);
    ctx.lineTo(620, 110);
    ctx.lineTo(680, 140);
    ctx.lineTo(700, 180);
    ctx.lineTo(680, 220);
    ctx.lineTo(640, 240);
    ctx.lineTo(580, 250);
    ctx.lineTo(520, 230);
    ctx.lineTo(490, 200);
    ctx.lineTo(470, 150);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Australia
    ctx.beginPath();
    ctx.moveTo(620, 350);
    ctx.lineTo(680, 340);
    ctx.lineTo(710, 360);
    ctx.lineTo(720, 390);
    ctx.lineTo(700, 420);
    ctx.lineTo(650, 430);
    ctx.lineTo(610, 410);
    ctx.lineTo(600, 380);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// Draw grid lines (latitude/longitude)
function drawGrid() {
    ctx.strokeStyle = '#b8d9e8';
    ctx.lineWidth = 0.5;
    
    // Vertical lines (longitude)
    for (let i = 0; i <= MAP_WIDTH; i += MAP_WIDTH / 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, MAP_HEIGHT);
        ctx.stroke();
    }
    
    // Horizontal lines (latitude)
    for (let i = 0; i <= MAP_HEIGHT; i += MAP_HEIGHT / 6) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(MAP_WIDTH, i);
        ctx.stroke();
    }
}

// Convert lat/long to canvas x/y
function latLongToXY(lat, lon) {
    // Simple equirectangular projection
    const x = ((lon + 180) / 360) * MAP_WIDTH;
    const y = ((90 - lat) / 180) * MAP_HEIGHT;
    return { x, y };
}

// Load all dives from the API
async function loadDives() {
    try {
        const response = await fetch(`${API_BASE}/api/dives`);
        if (!response.ok) throw new Error('Failed to fetch dives');
        
        dives = await response.json();
        displayDivesOnMap(dives);
        displayDiveList(dives);
        
        // Animate markers appearing one by one
        animateMarkers();
    } catch (error) {
        console.error('Error loading dives:', error);
        alert('Failed to load dive data. Please check the server connection.');
    }
}

// Display dives on the map
function displayDivesOnMap(dives) {
    // Redraw map
    drawMap();
    
    // Draw all dive markers
    dives.forEach((dive, index) => {
        const pos = latLongToXY(dive.latitude, dive.longitude);
        drawMarker(pos.x, pos.y, dive, index);
    });
}

// Draw a dive marker on the map
function drawMarker(x, y, dive, index) {
    // Draw marker shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(x + 2, y + 2, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw marker
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw marker border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw dive number
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(dive.dive_number, x, y);
}

// Animate markers appearing one by one
function animateMarkers() {
    if (!dives || dives.length === 0) return;
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < dives.length) {
            const dive = dives[index];
            if (!dive) {
                index++;
                return;
            }
            
            const pos = latLongToXY(dive.latitude, dive.longitude);
            
            // Create pulse effect
            let pulseRadius = 8;
            const pulseInterval = setInterval(() => {
                drawMap();
                
                // Redraw all previous markers
                for (let i = 0; i <= index && i < dives.length; i++) {
                    const d = dives[i];
                    if (d && d.latitude && d.longitude) {
                        const p = latLongToXY(d.latitude, d.longitude);
                        drawMarker(p.x, p.y, d, i);
                    }
                }
                
                // Draw pulse
                if (pulseRadius < 20) {
                    ctx.strokeStyle = `rgba(255, 107, 107, ${1 - (pulseRadius - 8) / 12})`;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, pulseRadius, 0, Math.PI * 2);
                    ctx.stroke();
                    pulseRadius += 1;
                } else {
                    clearInterval(pulseInterval);
                }
            }, 30);
            
            index++;
        } else {
            clearInterval(interval);
        }
    }, 500);
}

// Handle mouse movement on map
function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Check if hovering over any dive marker
    hoveredDive = null;
    for (const dive of dives) {
        const pos = latLongToXY(dive.latitude, dive.longitude);
        const distance = Math.sqrt(Math.pow(mouseX - pos.x, 2) + Math.pow(mouseY - pos.y, 2));
        
        if (distance < 10) {
            hoveredDive = dive;
            showTooltip(event.clientX, event.clientY, dive);
            canvas.style.cursor = 'pointer';
            return;
        }
    }
    
    // No dive hovered
    hideTooltip();
    canvas.style.cursor = 'crosshair';
}

// Handle click on map
function handleMapClick(event) {
    if (hoveredDive) {
        showDiveDetails(hoveredDive.id);
    }
}

// Show tooltip
function showTooltip(x, y, dive) {
    const tooltip = document.getElementById('map-tooltip');
    tooltip.innerHTML = `
        <h4>Dive #${dive.dive_number}</h4>
        <p><strong>${dive.location}</strong></p>
        <p>${dive.dive_site}</p>
        <p>Date: ${formatDate(dive.date)}</p>
        <p>Depth: ${dive.max_depth}m | Duration: ${dive.duration}min</p>
    `;
    tooltip.style.display = 'block';
    tooltip.style.left = (x + 10) + 'px';
    tooltip.style.top = (y - 80) + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('map-tooltip');
    tooltip.style.display = 'none';
}

// Display dive list in the sidebar
function displayDiveList(dives) {
    const diveListElement = document.getElementById('dive-list');
    diveListElement.innerHTML = '';
    
    if (dives.length === 0) {
        diveListElement.innerHTML = '<p>No dives recorded yet.</p>';
        return;
    }
    
    dives.forEach(dive => {
        const diveItem = document.createElement('div');
        diveItem.className = 'dive-item';
        diveItem.onclick = () => showDiveDetails(dive.id);
        
        diveItem.innerHTML = `
            <div class="dive-item-header">
                <span class="dive-number">Dive #${dive.dive_number}</span>
                <span class="dive-date">${formatDate(dive.date)}</span>
            </div>
            <div class="dive-location">${dive.location}</div>
            <div class="dive-site">${dive.dive_site}</div>
        `;
        
        diveListElement.appendChild(diveItem);
    });
}

// Load and display statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const stats = await response.json();
        
        // Animate the numbers
        animateValue('total-dives', 0, stats.total_dives, 1000);
        animateValue('total-time', 0, stats.total_dive_time, 1000);
        animateValue('max-depth', 0, stats.max_depth, 1000);
        animateValue('locations', 0, stats.locations, 1000);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Animate number counting
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Show dive details in modal
async function showDiveDetails(diveId) {
    try {
        const response = await fetch(`${API_BASE}/api/dives/${diveId}`);
        if (!response.ok) throw new Error('Failed to fetch dive details');
        
        const dive = await response.json();
        
        const detailsElement = document.getElementById('dive-details');
        detailsElement.innerHTML = `
            <h2 class="detail-title">Dive #${dive.dive_number} - ${dive.dive_site}</h2>
            
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formatDate(dive.date)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${dive.location}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Dive Site:</span>
                <span class="detail-value">${dive.dive_site}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Maximum Depth:</span>
                <span class="detail-value">${dive.max_depth} meters</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${dive.duration} minutes</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Water Temperature:</span>
                <span class="detail-value">${dive.water_temp}°C</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Visibility:</span>
                <span class="detail-value">${dive.visibility} meters</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Coordinates:</span>
                <span class="detail-value">${dive.latitude.toFixed(4)}, ${dive.longitude.toFixed(4)}</span>
            </div>
            
            ${dive.notes ? `
                <div style="margin-top: 20px;">
                    <div class="detail-label" style="margin-bottom: 10px;">Notes:</div>
                    <div class="detail-notes">${dive.notes}</div>
                </div>
            ` : ''}
        `;
        
        // Highlight the dive on the map
        drawMap();
        dives.forEach((d, i) => {
            const pos = latLongToXY(d.latitude, d.longitude);
            if (d.id === diveId) {
                // Draw highlighted marker
                ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
                ctx.fill();
            }
            drawMarker(pos.x, pos.y, d, i);
        });
        
        // Show modal
        document.getElementById('dive-modal').style.display = 'block';
    } catch (error) {
        console.error('Error loading dive details:', error);
        alert('Failed to load dive details.');
    }
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('dive-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        // Redraw map to remove highlight
        drawMap();
        dives.forEach((d, i) => {
            const pos = latLongToXY(d.latitude, d.longitude);
            drawMarker(pos.x, pos.y, d, i);
        });
    }
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            // Redraw map to remove highlight
            drawMap();
            dives.forEach((d, i) => {
                const pos = latLongToXY(d.latitude, d.longitude);
                drawMarker(pos.x, pos.y, d, i);
            });
        }
    }
}

// Format date to a readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
