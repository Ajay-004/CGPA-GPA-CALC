// Global state
let semesters = [];
let semesterIdCounter = 1;
let subjectIdCounter = 1;

// Grade mapping
const gradePoints = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5
};

const grades = ['O', 'A+', 'A', 'B+', 'B', 'C'];
const credits = [4, 3, 2, 1];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    addSemester();
});

// Semester management
function addSemester() {
    const semester = {
        id: `semester-${semesterIdCounter++}`,
        name: `Semester ${semesters.length + 1}`,
        subjects: [],
        gpa: null
    };
    
    semesters.push(semester);
    renderSemesters();
}

function removeSemester(semesterId) {
    semesters = semesters.filter(s => s.id !== semesterId);
    renderSemesters();
}

function updateSemesterName(semesterId, newName) {
    const semester = semesters.find(s => s.id === semesterId);
    if (semester) {
        semester.name = newName;
    }
}

// Subject management
function addSubject(semesterId) {
    const semester = semesters.find(s => s.id === semesterId);
    if (semester) {
        const subject = {
            id: `subject-${subjectIdCounter++}`,
            credits: '',
            grade: ''
        };
        semester.subjects.push(subject);
        renderSemesters();
    }
}

function removeSubject(semesterId, subjectId) {
    const semester = semesters.find(s => s.id === semesterId);
    if (semester) {
        semester.subjects = semester.subjects.filter(s => s.id !== subjectId);
        semester.gpa = calculateSemesterGPA(semester);
        renderSemesters();
    }
}

function updateSubject(semesterId, subjectId, field, value) {
    const semester = semesters.find(s => s.id === semesterId);
    if (semester) {
        const subject = semester.subjects.find(s => s.id === subjectId);
        if (subject) {
            subject[field] = field === 'credits' ? parseInt(value) || 0 : value;
            renderSemesters();
        }
    }
}

// GPA calculations
function calculateSemesterGPA(semester) {
    if (semester.subjects.length === 0) return null;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    for (const subject of semester.subjects) {
        if (subject.credits && subject.grade && gradePoints[subject.grade] !== undefined) {
            totalPoints += subject.credits * gradePoints[subject.grade];
            totalCredits += subject.credits;
        }
    }
    
    return totalCredits > 0 ? totalPoints / totalCredits : null;
}

function calculateSemesterGPAFor(semesterId) {
    const semester = semesters.find(s => s.id === semesterId);
    if (semester) {
        semester.gpa = calculateSemesterGPA(semester);
        renderSemesters();
    }
}

function calculateGPA() {
    semesters.forEach(semester => {
        semester.gpa = calculateSemesterGPA(semester);
    });
    renderSemesters();
}

// CGPA functionality
function showCGPASection() {
    const cgpaSection = document.getElementById('cgpa-section');
    cgpaSection.style.display = 'block';
    cgpaSection.scrollIntoView({ behavior: 'smooth' });
}

// Show CGPA section by default but without auto-scrolling
document.addEventListener('DOMContentLoaded', function() {
    const cgpaSection = document.getElementById('cgpa-section');
    cgpaSection.style.display = 'block';
});

function showManualGpaInputs() {
    const semesterCount = parseInt(document.getElementById('semester-count').value);
    const container = document.getElementById('manual-gpa-inputs');
    
    if (!semesterCount) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    container.innerHTML = '';
    
    for (let i = 1; i <= semesterCount; i++) {
        const inputRow = document.createElement('div');
        inputRow.className = 'gpa-input-row';
        inputRow.innerHTML = `
            <label>Semester ${i} GPA:</label>
            <input type="number" 
                   id="gpa-${i}" 
                   class="form-input" 
                   placeholder="Enter GPA (0-10)" 
                   min="0" 
                   max="10" 
                   step="0.01">
        `;
        container.appendChild(inputRow);
    }
    
    // Add calculate button
    const calculateBtn = document.createElement('button');
    calculateBtn.className = 'btn btn-accent';
    calculateBtn.style.marginTop = '1rem';
    calculateBtn.innerHTML = ' Calculate CGPA';
    calculateBtn.onclick = calculateCGPA;
    container.appendChild(calculateBtn);
}

function calculateCGPA() {
    const semesterCount = parseInt(document.getElementById('semester-count').value);
    const resultDiv = document.getElementById('cgpa-result');
    const cgpaValueDiv = document.getElementById('cgpa-value');
    
    let totalGPA = 0;
    let validSemesters = 0;
    
    for (let i = 1; i <= semesterCount; i++) {
        const gpaInput = document.getElementById(`gpa-${i}`);
        const gpa = parseFloat(gpaInput.value);
        
        if (!isNaN(gpa) && gpa >= 0 && gpa <= 10) {
            totalGPA += gpa;
            validSemesters++;
        }
    }
    
    if (validSemesters === 0) {
        alert('Please enter valid GPA values (0-10) for at least one semester.');
        return;
    }
    
    const cgpa = totalGPA / validSemesters;
    cgpaValueDiv.textContent = cgpa.toFixed(2);
    resultDiv.style.display = 'block';
}

// Reset functionality
function resetData() {
    // Create custom modal instead of basic confirm
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fade-in 0.3s ease-out;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: hsl(var(--card));
        border: 1px solid hsl(var(--border));
        border-radius: 0.75rem;
        box-shadow: var(--shadow-elegant);
        padding: 2rem;
        max-width: 400px;
        margin: 1rem;
        text-align: center;
        animation: scale-in 0.3s ease-out;
    `;
    
    modalContent.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            
            <h3 style="margin: 0 0 0.5rem 0; color: hsl(var(--destructive));">Reset All Data?</h3>
            <p style="margin: 0; color: hsl(var(--muted-foreground));">
                This will permanently delete all semesters, subjects, and calculated results.
            </p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn btn-destructive" onclick="confirmReset()">
                
                Reset Everything
            </button>
            <button class="btn btn-outline" onclick="cancelReset()">
               
                Cancel
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Store modal reference
    window.resetModal = modal;
}

function confirmReset() {
    // Perform reset
    semesters = [];
    semesterIdCounter = 1;
    subjectIdCounter = 1;
    
    document.getElementById('semester-count').value = '';
    document.getElementById('manual-gpa-inputs').style.display = 'none';
    document.getElementById('cgpa-result').style.display = 'none';
    
    // Show success notification
    showNotification('🎉 All data has been reset successfully!', 'success');
    
    // Close modal
    cancelReset();
    
    // Add new semester without showing CGPA section
    addSemester();
}

function cancelReset() {
    if (window.resetModal) {
        document.body.removeChild(window.resetModal);
        window.resetModal = null;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'hsl(var(--success))' : 'hsl(var(--primary))'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-elegant);
        z-index: 1001;
        animation: slide-in 0.3s ease-out;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fade-out 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Rendering
function renderSemesters() {
    const container = document.getElementById('semesters-container');
    container.innerHTML = '';
    
    if (semesters.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="icon">📚</span>
                <p>No semesters added yet</p>
                <p>Click "Add Semester" to get started</p>
            </div>
        `;
        return;
    }
    
    semesters.forEach(semester => {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester-card';
        
        const totalCredits = semester.subjects.reduce((sum, subject) => sum + (subject.credits || 0), 0);
        
        semesterDiv.innerHTML = `
            <div class="semester-header">
                <div class="semester-title-row">
                    <div class="semester-title">
                        <span class="icon">📖</span>
                        <input type="text" 
                               class="semester-name-input" 
                               value="${semester.name}"
                               onchange="updateSemesterName('${semester.id}', this.value)"
                               placeholder="Semester Name">
                    </div>
                    <button class="btn btn-destructive btn-icon delete-semester-btn" 
                            onclick="removeSemester('${semester.id}')"
                            title="Remove Semester">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
                
                ${semester.gpa !== null ? `
                    <div class="gpa-display">
                        <div class="gpa-info">
                            <span class="icon">🏆</span>
                            <div>
                                <h3>Semester GPA</h3>
                                <div class="gpa-value">${semester.gpa.toFixed(2)}</div>
                            </div>
                        </div>
                        <div class="total-credits">
                            <p class="label">Total Credits</p>
                            <p class="value">${totalCredits}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="subject-headers">
                <div>Credits</div>
                <div>Grade</div>
                <div></div>
            </div>
            
            <div class="subjects-list">
                ${semester.subjects.map(subject => `
                    <div class="subject-row">
                        <select class="form-select" 
                                onchange="updateSubject('${semester.id}', '${subject.id}', 'credits', this.value)"
                                value="${subject.credits}">
                            <option value="">Credits</option>
                            ${credits.map(credit => `
                                <option value="${credit}" ${subject.credits === credit ? 'selected' : ''}>${credit}</option>
                            `).join('')}
                        </select>
                        
                        <select class="form-select" 
                                onchange="updateSubject('${semester.id}', '${subject.id}', 'grade', this.value)"
                                value="${subject.grade}">
                            <option value="">Grade</option>
                            ${grades.map(grade => `
                                <option value="${grade}" ${subject.grade === grade ? 'selected' : ''}>${grade}</option>
                            `).join('')}
                        </select>
                        
                        <button class="btn btn-destructive btn-icon btn-sm delete-subject-btn" 
                                onclick="removeSubject('${semester.id}', '${subject.id}')"
                                title="Remove Subject">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                `).join('')}
                
                ${semester.subjects.length === 0 ? `
                    <div class="empty-state">
                        <span class="icon">📖</span>
                        <p>No subjects added yet</p>
                        <p>Click "Add Subject" to get started</p>
                    </div>
                ` : ''}
            </div>
            
              <div class="add-subject-container">
                <button class="btn add-subject-btn" onclick="addSubject('${semester.id}')">
                    <span class="icon">➕</span>
                    Add Subject
                </button>
                <button class="btn btn-accent calculate-gpa-btn" onclick="calculateSemesterGPAFor('${semester.id}')">
                    
                    Calculate GPA
                </button>
            </div>
        `;
        
        container.appendChild(semesterDiv);
    });
}
