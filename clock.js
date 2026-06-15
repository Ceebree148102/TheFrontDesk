// ============ TIMEZONE CLOCK APPLICATION ============

let timeFormat = '12h';
let viewMode = 'grid';
let clocks = [];

// All available time zones
const timezones = [
    'Africa/Johannesburg', 'Africa/Cairo', 'Africa/Lagos', 'Africa/Nairobi',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Anchorage', 'America/Toronto', 'America/Mexico_City', 'America/Sao_Paulo',
    'America/Buenos_Aires', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'Europe/Moscow', 'Europe/Istanbul', 'Europe/Dubai', 'Asia/Bangkok',
    'Asia/Hong_Kong', 'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul',
    'Asia/Singapore', 'Asia/Kolkata', 'Asia/Manila', 'Australia/Sydney',
    'Australia/Melbourne', 'Australia/Perth', 'Pacific/Auckland', 'Pacific/Fiji',
    'UTC', 'GMT'
];

// Popular timezones with city names
const popularTimezones = {
    'America/New_York': 'New York (EST)',
    'America/Los_Angeles': 'Los Angeles (PST)',
    'America/Chicago': 'Chicago (CST)',
    'Europe/London': 'London (GMT)',
    'Europe/Paris': 'Paris (CET)',
    'Europe/Moscow': 'Moscow (MSK)',
    'Africa/Cairo': 'Cairo (EET)',
    'Africa/Johannesburg': 'Johannesburg (SAST)',
    'Africa/Lagos': 'Lagos (WAT)',
    'Africa/Nairobi': 'Nairobi (EAT)',
    'Asia/Dubai': 'Dubai (GST)',
    'Asia/Bangkok': 'Bangkok (ICT)',
    'Asia/Hong_Kong': 'Hong Kong (HKT)',
    'Asia/Shanghai': 'Shanghai (CST)',
    'Asia/Tokyo': 'Tokyo (JST)',
    'Asia/Seoul': 'Seoul (KST)',
    'Asia/Singapore': 'Singapore (SGT)',
    'Asia/Kolkata': 'India (IST)',
    'Australia/Sydney': 'Sydney (AEDT)',
    'Australia/Melbourne': 'Melbourne (AEDT)',
    'Pacific/Auckland': 'Auckland (NZDT)',
    'UTC': 'UTC / GMT'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    populateTimezoneSelect();
    addDefaultClocks();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);

    // Handle form submission
    document.getElementById('addTimezoneForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addTimezoneClock();
    });

    // Load saved clocks from localStorage
    loadClocks();
});

// Populate timezone select dropdown
function populateTimezoneSelect() {
    const select = document.getElementById('timezoneSelect');
    
    // Add popular timezones first
    const optgroup1 = document.createElement('optgroup');
    optgroup1.label = 'Popular Cities';
    Object.entries(popularTimezones).forEach(([tz, name]) => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = name;
        optgroup1.appendChild(option);
    });
    select.appendChild(optgroup1);

    // Add all timezones
    const optgroup2 = document.createElement('optgroup');
    optgroup2.label = 'All Timezones';
    timezones.forEach(tz => {
        if (!popularTimezones[tz]) {
            const option = document.createElement('option');
            option.value = tz;
            option.textContent = tz;
            optgroup2.appendChild(option);
        }
    });
    select.appendChild(optgroup2);
}

// Add default clocks
function addDefaultClocks() {
    const defaults = ['UTC', 'America/New_York', 'Asia/Tokyo', 'Europe/London'];
    defaults.forEach(tz => {
        addClock(tz, popularTimezones[tz] || tz);
    });
}

// Add timezone clock
function addTimezoneClock() {
    const timezone = document.getElementById('timezoneSelect').value;
    const cityName = document.getElementById('cityName').value.trim();

    if (!timezone) {
        alert('Please select a time zone!');
        return;
    }

    const name = cityName || popularTimezones[timezone] || timezone;
    addClock(timezone, name);
    closeAddTimezoneModal();
    document.getElementById('addTimezoneForm').reset();
    saveClocks();
}

// Add a clock to the display
function addClock(timezone, name) {
    const id = Date.now();
    clocks.push({
        id: id,
        timezone: timezone,
        name: name
    });
    
    renderClocks();
}

// Remove a clock
function removeClock(id) {
    clocks = clocks.filter(c => c.id !== id);
    renderClocks();
    saveClocks();
}

// Remove all clocks
function removeAllClocks() {
    if (confirm('Are you sure you want to remove all clocks?')) {
        clocks = [];
        renderClocks();
        saveClocks();
    }
}

// Save clocks to localStorage
function saveClocks() {
    localStorage.setItem('timezoneClocks', JSON.stringify(clocks));
}

// Load clocks from localStorage
function loadClocks() {
    const saved = localStorage.getItem('timezoneClocks');
    if (saved) {
        clocks = JSON.parse(saved);
        renderClocks();
    }
}

// Render all clocks
function renderClocks() {
    const grid = document.getElementById('clocksGrid');
    const emptyState = document.getElementById('emptyState');

    if (clocks.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    grid.innerHTML = clocks.map(clock => createClockHTML(clock)).join('');
}

// Create clock HTML
function createClockHTML(clock) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: clock.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: timeFormat === '12h'
    });

    const parts = formatter.formatToParts(now);
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;
    const second = parts.find(p => p.type === 'second').value;
    const period = parts.find(p => p.type === 'dayPeriod');

    // Get date
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: clock.timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const dateStr = dateFormatter.format(now);

    // Get timezone offset
    const offset = getTimezoneOffset(clock.timezone, now);

    // Get sunrise and sunset times
    const { sunrise, sunset } = getSunriseSunset(clock.timezone, now);

    // Digital time
    const digitalTime = `${hour}:${minute}:${second}${timeFormat === '12h' && period ? ' ' + period.value : ''}`;

    // Analog clock hands angles
    const hourAngle = (parseInt(hour) % 12) * 30 + parseInt(minute) * 0.5;
    const minuteAngle = parseInt(minute) * 6 + parseInt(second) * 0.1;
    const secondAngle = parseInt(second) * 6;

    return `
        <div class="clock-card" data-id="${clock.id}">
            <div class="timezone-name">${clock.name}</div>
            <div class="timezone-offset">${offset}</div>
            
            ${viewMode === 'grid' || viewMode === 'analog' ? `
                <div class="analog-clock">
                    <div class="clock-number">
                        <span style="transform: rotate(0deg) translateY(-85px);">12</span>
                        <span style="transform: rotate(90deg) translateY(-85px);">3</span>
                        <span style="transform: rotate(180deg) translateY(-85px);">6</span>
                        <span style="transform: rotate(270deg) translateY(-85px);">9</span>
                    </div>
                    <div class="hand hour-hand" style="transform: rotate(${hourAngle}deg)"></div>
                    <div class="hand minute-hand" style="transform: rotate(${minuteAngle}deg)"></div>
                    <div class="hand second-hand" style="transform: rotate(${secondAngle}deg)"></div>
                    <div class="clock-center"></div>
                </div>
            ` : ''}
            
            ${viewMode === 'grid' || viewMode === 'digital' ? `
                <div class="digital-clock">${digitalTime}</div>
            ` : ''}
            
            <div class="date-info">
                <div>${dateStr}</div>
                <div class="sunrise-sunset">
                    <i class="fas fa-sun"></i>${sunrise}
                    <i class="fas fa-moon"></i>${sunset}
                </div>
            </div>
            
            <div class="clock-actions">
                <button class="action-btn delete" onclick="removeClock(${clock.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `;
}

// Update all clocks every second
function updateAllClocks() {
    renderClocks();
}

// Get timezone offset
function getTimezoneOffset(timezone, date) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset'
    });
    
    const parts = formatter.formatToParts(date);
    const offset = parts.find(p => p.type === 'timeZoneName')?.value || '';
    
    return offset;
}

// Get sunrise and sunset times (simplified)
function getSunriseSunset(timezone, date) {
    // This is a simplified calculation
    // For production, use a proper sunrise/sunset API
    const hour = date.getHours();
    
    // Rough estimates based on time of day
    let sunrise = '06:00';
    let sunset = '18:00';
    
    // Adjust based on season (simplified)
    const month = date.getMonth();
    if (month >= 5 && month <= 7) { // Summer
        sunrise = '05:00';
        sunset = '20:00';
    } else if (month >= 11 || month <= 1) { // Winter
        sunrise = '07:00';
        sunset = '17:00';
    }
    
    return { sunrise, sunset };
}

// Set time format
function setTimeFormat(format) {
    timeFormat = format;
    
    // Update buttons
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderClocks();
}

// Set view mode
function setViewMode(mode) {
    viewMode = mode;
    
    // Update buttons
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-toggle-btn').classList.add('active');
    
    renderClocks();
}

// Open add timezone modal
function openAddTimezoneModal() {
    document.getElementById('addTimezoneModal').classList.add('active');
    document.getElementById('timezoneSelect').focus();
}

// Close add timezone modal
function closeAddTimezoneModal() {
    document.getElementById('addTimezoneModal').classList.remove('active');
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('addTimezoneModal');
    if (e.target === modal) {
        closeAddTimezoneModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAddTimezoneModal();
    }
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openAddTimezoneModal();
    }
});
