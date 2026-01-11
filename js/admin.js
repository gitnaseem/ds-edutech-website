// Admin Dashboard JavaScript

// Check if user is logged in
(function() {
  const adminAuth = localStorage.getItem('admin_logged_in');
  
  if (adminAuth !== 'true') {
    window.location.href = 'admin-login-v2.html';
  }
})();

// Global variable to store course image data
let courseImageData = null;

// Global variable to store founder image data
let founderImageData = null;

// Show/Hide sections
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => section.classList.remove('active'));

  // Remove active class from all menu links
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => link.classList.remove('active'));

  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Find and highlight the clicked menu link by matching href
  const clickedLink = document.querySelector('a[onclick*="' + sectionId + '"]');
  if (clickedLink) {
    clickedLink.classList.add('active');
  }

  // Load section-specific data
  if (sectionId === 'courses') {
    loadCourses();
    loadWebsiteCourses();
  } else if (sectionId === 'testimonials') {
    loadTestimonials();
  } else if (sectionId === 'about') {
    loadAboutSection();
  } else if (sectionId === 'contact') {
    loadContact();
  } else if (sectionId === 'hero') {
    loadHero();
  } else if (sectionId === 'results') {
    loadStudentResults();
  } else if (sectionId === 'settings') {
    loadSettingsDisplay();
  }
}

// Switch course management tabs
function switchCourseTab(tab) {
  document.getElementById('courseTabAdd').style.display = tab === 'add' ? 'block' : 'none';
  document.getElementById('courseTabEdit').style.display = tab === 'edit' ? 'block' : 'none';
  document.getElementById('courseTabCustom').style.display = tab === 'custom' ? 'block' : 'none';

  // Update tab styles
  document.querySelectorAll('.form-tab').forEach(t => {
    t.style.borderBottomColor = 'transparent';
    t.style.color = '#999';
  });
  event.target.style.borderBottomColor = 'var(--primary-color)';
  event.target.style.color = 'var(--primary-color)';

  if (tab === 'edit') {
    loadWebsiteCourses();
  } else if (tab === 'custom') {
    loadCourses();
  }
}

// Show message helper
function showMessage(type, message) {
  const successMsg = document.getElementById('successMessage');
  const errorMsg = document.getElementById('errorMessage');

  if (type === 'success') {
    successMsg.textContent = '✓ ' + message;
    successMsg.style.display = 'block';
    errorMsg.style.display = 'none';
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 3000);
  } else if (type === 'error') {
    errorMsg.textContent = '✗ ' + message;
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    setTimeout(() => {
      errorMsg.style.display = 'none';
    }, 3000);
  }
}

// Preview founder image
function previewFounderImage(input) {
  const previewDiv = document.getElementById('founderImagePreview');
  const statusDiv = document.getElementById('founderImageStatus');
  
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2);
    
    statusDiv.innerHTML = `<strong>✓ File Selected:</strong> ${fileName} (${fileSize} KB)`;
    statusDiv.style.color = '#28a745';
    
    if (file.size > 500 * 1024) {
      statusDiv.innerHTML = `<strong style="color: #dc3545;">✗ File too large:</strong> ${fileName} is ${fileSize} KB. Max allowed is 500 KB`;
      statusDiv.style.color = '#dc3545';
      previewDiv.innerHTML = '';
      input.value = '';
      founderImageData = null;
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        founderImageData = e.target.result;
        previewDiv.innerHTML = `<img src="${e.target.result}" class="image-preview" alt="Founder image preview" style="border: 2px solid #00b386; border-radius: 8px; max-width: 200px;">`;
        statusDiv.innerHTML = `<strong style="color: #28a745;">✓ Image Ready:</strong> ${fileName} is ready to upload`;
        statusDiv.style.color = '#28a745';
      } catch (error) {
        statusDiv.innerHTML = `<strong style="color: #dc3545;">✗ Error:</strong> Failed to process image`;
        statusDiv.style.color = '#dc3545';
        founderImageData = null;
      }
    };
    reader.onerror = function() {
      statusDiv.innerHTML = `<strong style="color: #dc3545;">✗ Error:</strong> Failed to read file`;
      statusDiv.style.color = '#dc3545';
      previewDiv.innerHTML = '';
      founderImageData = null;
    };
    reader.readAsDataURL(file);
  } else {
    previewDiv.innerHTML = '';
    statusDiv.innerHTML = '';
    founderImageData = null;
  }
}

// Preview course image
function previewCourseImage(input) {
  const previewDiv = document.getElementById('courseImagePreview');
  const statusDiv = document.getElementById('courseImageStatus');
  
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2); // in KB
    
    // Show filename
    statusDiv.innerHTML = `<strong>✓ File Selected:</strong> ${fileName} (${fileSize} KB)`;
    statusDiv.style.color = '#28a745';
    
    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      statusDiv.innerHTML = `<strong style="color: #dc3545;">✗ File too large:</strong> ${fileName} is ${fileSize} KB. Max allowed is 500 KB`;
      statusDiv.style.color = '#dc3545';
      previewDiv.innerHTML = '';
      input.value = '';
      courseImageData = null;
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        courseImageData = e.target.result;
        previewDiv.innerHTML = `<img src="${e.target.result}" class="image-preview" alt="Course image preview" style="border: 2px solid #00b386; border-radius: 8px;">`;
        statusDiv.innerHTML = `<strong style="color: #28a745;">✓ Image Ready:</strong> ${fileName} is ready to upload`;
        statusDiv.style.color = '#28a745';
      } catch (error) {
        statusDiv.innerHTML = `<strong style="color: #dc3545;">✗ Error:</strong> Failed to process image`;
        statusDiv.style.color = '#dc3545';
        courseImageData = null;
      }
    };
    reader.onerror = function(error) {
      statusDiv.innerHTML = `<strong style="color: #dc3545;">✗ Error:</strong> Failed to read file`;
      statusDiv.style.color = '#dc3545';
      previewDiv.innerHTML = '';
      courseImageData = null;
    };
    reader.readAsDataURL(file);
  } else {
    previewDiv.innerHTML = '';
    statusDiv.innerHTML = '';
    courseImageData = null;
  }
}

// Website courses data (hardcoded from courses.html)
const websiteCoursesData = [
  { id: 'physics', title: 'Physics Fundamentals', category: 'Science', level: 'BEGINNER', videos: 45, hours: 40, description: 'Master mechanics, thermodynamics, waves, and electricity through interactive simulations and real-world examples.' },
  { id: 'chemistry', title: 'Chemistry Concepts', category: 'Science', level: 'BEGINNER', videos: 50, hours: 45, description: 'Understand atomic structure, bonding, reactions, and organic chemistry with detailed molecular models and animations.' },
  { id: 'biology', title: 'Biology & Life Sciences', category: 'Science', level: 'BEGINNER', videos: 48, hours: 42, description: 'Explore cell biology, genetics, human physiology, and ecology with 3D models and comprehensive explanations.' },
  { id: 'mathscience', title: 'Mathematics for Science', category: 'Science', level: 'INTERMEDIATE', videos: 52, hours: 48, description: 'Advanced calculus, vectors, and statistical methods essential for science subjects and competitive exams.' },
  { id: 'labsim', title: 'Lab Simulations', category: 'Science', level: 'INTERMEDIATE', videos: 30, hours: 25, description: 'Perform virtual experiments safely. Practice important lab procedures with interactive simulations and video guides.' },
  { id: 'sciencetest', title: 'Science Exam Practice', category: 'Science', level: 'ADVANCED', videos: 100, hours: 999, description: 'Comprehensive test series with previous year papers, mock exams, and detailed solutions. Track your progress.' },
  { id: 'history', title: 'History & Culture', category: 'Arts', level: 'BEGINNER', videos: 55, hours: 50, description: 'Journey through ancient, medieval, and modern history with engaging narratives, timelines, and historical context.' },
  { id: 'geography', title: 'Geography Insights', category: 'Arts', level: 'BEGINNER', videos: 48, hours: 44, description: 'Explore physical and human geography with maps, diagrams, and real-world examples. Master geographical analysis.' },
  { id: 'economics', title: 'Economics Basics', category: 'Arts', level: 'BEGINNER', videos: 45, hours: 40, description: 'Understand micro and macro economics, market structures, and government policies through practical examples.' },
  { id: 'literature', title: 'English Literature', category: 'Arts', level: 'INTERMEDIATE', videos: 60, hours: 55, description: 'Dive into classic and modern literature with detailed analysis, character studies, and thematic exploration.' },
  { id: 'politicalscience', title: 'Political Science', category: 'Arts', level: 'INTERMEDIATE', videos: 50, hours: 46, description: 'Study political systems, governance, international relations, and constitutional frameworks with real-world case studies.' },
  { id: 'artstest', title: 'Arts Test Series', category: 'Arts', level: 'ADVANCED', videos: 85, hours: 999, description: 'Comprehensive test series covering all arts subjects with board exam papers, mock exams, and detailed solutions.' },
  { id: 'accountancy', title: 'Accountancy', category: 'Commerce', level: 'BEGINNER', videos: 65, hours: 60, description: 'Master journal entries, ledgers, and financial statements. Learn accounting principles with practical examples.' },
  { id: 'businessstudies', title: 'Business Studies', category: 'Commerce', level: 'BEGINNER', videos: 55, hours: 50, description: 'Understand business organization, management concepts, and entrepreneurship with case studies and business models.' },
  { id: 'commerceeconomics', title: 'Economics for Commerce', category: 'Commerce', level: 'INTERMEDIATE', videos: 50, hours: 46, description: 'Economics tailored for commerce students covering market structures, consumer behavior, and policy analysis.' },
  { id: 'mathcommerce', title: 'Mathematics for Commerce', category: 'Commerce', level: 'INTERMEDIATE', videos: 55, hours: 50, description: 'Essential mathematics for commerce including statistics, financial mathematics, and calculus applications.' },
  { id: 'casestudies', title: 'Case Studies', category: 'Commerce', level: 'ADVANCED', videos: 35, hours: 32, description: 'Real-world business cases and scenarios. Develop decision-making skills for competitive exams and business.' },
  { id: 'commercetest', title: 'Commerce Test Series', category: 'Commerce', level: 'ADVANCED', videos: 90, hours: 999, description: 'Comprehensive test series with board papers, mock exams, and detailed solutions. Master the exam pattern.' }
];

// Load website courses for editing
function loadWebsiteCourses() {
  const container = document.getElementById('websiteCoursesContainer');
  
  // Get edited versions from localStorage if they exist
  const editedWebsiteCourses = JSON.parse(localStorage.getItem('editedWebsiteCourses')) || {};
  
  let html = '<div style="display: grid; gap: 2rem;">';
  
  websiteCoursesData.forEach(course => {
    const edited = editedWebsiteCourses[course.id] || course;
    const imagePreview = edited.image ? `<img src="${edited.image}" class="image-preview" alt="${edited.title}">` : '<p style="color: #999; font-size: 0.9rem;">No image</p>';
    
    html += `
      <div class="admin-card" style="background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%);" data-category="${edited.category}">
        <h3 style="color: var(--primary-color);">${edited.title}</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div class="admin-form-group">
            <label>Course Title</label>
            <input type="text" value="${edited.title}" onchange="updateWebsiteCourse('${course.id}', 'title', this.value)">
          </div>
          <div class="admin-form-group">
            <label>Category</label>
            <select onchange="updateWebsiteCourse('${course.id}', 'category', this.value)">
              <option ${edited.category === 'Science' ? 'selected' : ''}>Science</option>
              <option ${edited.category === 'Arts' ? 'selected' : ''}>Arts</option>
              <option ${edited.category === 'Commerce' ? 'selected' : ''}>Commerce</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label>Level</label>
            <select onchange="updateWebsiteCourse('${course.id}', 'level', this.value)">
              <option ${edited.level === 'BEGINNER' ? 'selected' : ''}>BEGINNER</option>
              <option ${edited.level === 'INTERMEDIATE' ? 'selected' : ''}>INTERMEDIATE</option>
              <option ${edited.level === 'ADVANCED' ? 'selected' : ''}>ADVANCED</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div class="admin-form-group">
            <label>Number of Videos</label>
            <input type="number" value="${edited.videos}" onchange="updateWebsiteCourse('${course.id}', 'videos', this.value)">
          </div>
          <div class="admin-form-group">
            <label>Hours</label>
            <input type="number" value="${edited.hours}" onchange="updateWebsiteCourse('${course.id}', 'hours', this.value)">
          </div>
        </div>

        <div class="admin-form-group">
          <label>Description</label>
          <textarea onchange="updateWebsiteCourse('${course.id}', 'description', this.value)">${edited.description}</textarea>
        </div>

        <div class="admin-form-group">
          <label>Course Card Image</label>
          <div style="display: flex; gap: 1rem; align-items: start; margin-bottom: 1rem;">
            <div style="flex: 1;">
              <input type="file" id="image_${course.id}" accept="image/*" onchange="handleWebsiteCourseImage('${course.id}', this)">
              <small style="color: #666; display: block; margin-top: 0.5rem;">JPG, PNG, or GIF (max 500KB)</small>
            </div>
            <div>${imagePreview}</div>
          </div>
        </div>

        <button class="admin-button secondary" onclick="resetWebsiteCourse('${course.id}')">↺ Reset to Default</button>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  // Show all courses by default
  filterWebsiteCourses('all');
}

// Handle website course image upload
function handleWebsiteCourseImage(courseId, input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      showMessage('error', 'Image size should be less than 500KB');
      input.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      updateWebsiteCourse(courseId, 'image', e.target.result);
      loadWebsiteCourses(); // Refresh to show preview
    };
    reader.readAsDataURL(file);
  }
}

// Update website course
function updateWebsiteCourse(courseId, field, value) {
  let editedCourses = JSON.parse(localStorage.getItem('editedWebsiteCourses')) || {};
  
  if (!editedCourses[courseId]) {
    editedCourses[courseId] = websiteCoursesData.find(c => c.id === courseId);
  }
  
  editedCourses[courseId][field] = isNaN(value) ? value : parseInt(value);
  localStorage.setItem('editedWebsiteCourses', JSON.stringify(editedCourses));
  
  if (field === 'image') {
    showMessage('success', 'Course image updated!');
  } else {
    showMessage('success', 'Course updated!');
  }
}

// Reset website course to default
function resetWebsiteCourse(courseId) {
  if (!confirm('Reset this course to default values?')) return;
  
  let editedCourses = JSON.parse(localStorage.getItem('editedWebsiteCourses')) || {};
  delete editedCourses[courseId];
  localStorage.setItem('editedWebsiteCourses', JSON.stringify(editedCourses));
  
  loadWebsiteCourses();
  showMessage('success', 'Course reset to default!');
}

// Filter website courses by category
function filterWebsiteCourses(category) {
  // Update button styles
  document.getElementById('filterAll').style.background = category === 'all' ? 'var(--primary-color)' : 'white';
  document.getElementById('filterAll').style.color = category === 'all' ? 'white' : 'var(--primary-color)';
  document.getElementById('filterAll').style.border = category === 'all' ? 'none' : '2px solid var(--primary-color)';

  document.getElementById('filterScience').style.background = category === 'Science' ? 'var(--primary-color)' : 'white';
  document.getElementById('filterScience').style.color = category === 'Science' ? 'white' : 'var(--primary-color)';
  document.getElementById('filterScience').style.border = category === 'Science' ? 'none' : '2px solid var(--primary-color)';

  document.getElementById('filterArts').style.background = category === 'Arts' ? 'var(--primary-color)' : 'white';
  document.getElementById('filterArts').style.color = category === 'Arts' ? 'white' : 'var(--primary-color)';
  document.getElementById('filterArts').style.border = category === 'Arts' ? 'none' : '2px solid var(--primary-color)';

  document.getElementById('filterCommerce').style.background = category === 'Commerce' ? 'var(--primary-color)' : 'white';
  document.getElementById('filterCommerce').style.color = category === 'Commerce' ? 'white' : 'var(--primary-color)';
  document.getElementById('filterCommerce').style.border = category === 'Commerce' ? 'none' : '2px solid var(--primary-color)';

  // Show/hide course cards
  const cards = document.querySelectorAll('[data-category]');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  // Scroll to top of courses
  document.getElementById('websiteCoursesContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// COURSES MANAGEMENT
function addCourse() {
  const title = document.getElementById('courseTitle').value.trim();
  const category = document.getElementById('courseCategory').value;
  const level = document.getElementById('courseLevel').value;
  const description = document.getElementById('courseDescription').value.trim();
  const videos = document.getElementById('courseVideos').value;
  const hours = document.getElementById('courseHours').value;

  if (!title || !category || !level || !description || !videos || !hours) {
    showMessage('error', 'Please fill all course fields');
    return;
  }

  // Validate numbers are positive
  if (parseInt(videos) < 0 || parseInt(hours) < 0) {
    showMessage('error', 'Videos and hours must be positive numbers');
    return;
  }

  // Limit title length
  if (title.length > 100) {
    showMessage('error', 'Course title must be less than 100 characters');
    return;
  }

  // Limit description length
  if (description.length > 500) {
    showMessage('error', 'Course description must be less than 500 characters');
    return;
  }

  // Get existing courses
  let courses = JSON.parse(localStorage.getItem('adminCourses')) || [];

  // Add new course with image
  // category = Class (9th Class, 10th Class, 11th Class, 12th Class)
  // level = Subject (Science, Arts, Commerce, General)
  const newCourse = {
    id: Date.now(),
    title: title,
    category: category,  // Class: 9th Class, 10th Class, 11th Class, 12th Class
    level: level,        // Subject: Science, Arts, Commerce, General
    description: description,
    videos: parseInt(videos),
    hours: parseInt(hours),
    image: courseImageData || null,
    createdAt: new Date().toLocaleDateString()
  };

  courses.push(newCourse);
  
  try {
    // Use Firebase sync function for cloud backup
    if (typeof saveData === 'function') {
      saveData('adminCourses', courses);
    } else {
      // Fallback to localStorage only
      localStorage.setItem('adminCourses', JSON.stringify(courses));
    }
    console.log('Course saved:', newCourse);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      showMessage('error', 'Storage limit exceeded. Image file may be too large.');
      return;
    }
    showMessage('error', 'Failed to save course: ' + error.message);
    return;
  }

  // Clear form and global variable
  document.getElementById('courseTitle').value = '';
  document.getElementById('courseCategory').value = '9th Class';
  document.getElementById('courseLevel').value = 'Science';
  document.getElementById('courseDescription').value = '';
  document.getElementById('courseVideos').value = '';
  document.getElementById('courseHours').value = '';
  document.getElementById('courseImage').value = '';
  document.getElementById('courseImagePreview').innerHTML = '';
  document.getElementById('courseImageStatus').innerHTML = '';
  courseImageData = null;

  showMessage('success', 'Course added successfully! ✓ ' + (newCourse.image ? 'Image uploaded' : 'No image'));
  loadCourses();
}

function loadCourses() {
  const courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
  const coursesList = document.getElementById('coursesList');

  if (courses.length === 0) {
    coursesList.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No custom courses yet. Add one above!</td></tr>';
    return;
  }

  let html = '';
  courses.forEach(course => {
    html += `
      <tr>
        <td>${course.title}</td>
        <td>${course.category}</td>
        <td>${course.level}</td>
        <td>${course.videos} videos</td>
        <td>
          <button class="admin-button danger" style="padding: 0.5rem 1rem; margin: 0;" onclick="deleteCourse(${course.id})">Delete</button>
        </td>
      </tr>
    `;
  });

  coursesList.innerHTML = html;
}

function deleteCourse(id) {
  if (!confirm('Are you sure you want to delete this course?')) return;

  let courses = JSON.parse(localStorage.getItem('adminCourses')) || [];
  courses = courses.filter(course => course.id !== id);
  
  // Use Firebase sync function for cloud backup
  if (typeof saveData === 'function') {
    saveData('adminCourses', courses);
  } else {
    // Fallback to localStorage only
    localStorage.setItem('adminCourses', JSON.stringify(courses));
  }

  showMessage('success', 'Course deleted successfully!');
  loadCourses();
}

// TESTIMONIALS MANAGEMENT
function addTestimonial() {
  const name = document.getElementById('testimonialName').value.trim();
  const position = document.getElementById('testimonialPosition').value.trim();
  const rating = document.getElementById('testimonialRating').value;
  const text = document.getElementById('testimonialText').value.trim();

  if (!name || !position || !text) {
    showMessage('error', 'Please fill all testimonial fields');
    return;
  }

  // Validate name length
  if (name.length > 100) {
    showMessage('error', 'Student name must be less than 100 characters');
    return;
  }

  // Validate position length
  if (position.length > 100) {
    showMessage('error', 'Position/Class must be less than 100 characters');
    return;
  }

  // Validate text length
  if (text.length > 1000) {
    showMessage('error', 'Testimonial text must be less than 1000 characters');
    return;
  }

  // Get existing testimonials
  let testimonials = JSON.parse(localStorage.getItem('adminTestimonials')) || [];

  // Add new testimonial
  const newTestimonial = {
    id: Date.now(),
    name: name,
    position: position,
    rating: parseInt(rating),
    text: text,
    createdAt: new Date().toLocaleDateString()
  };

  testimonials.push(newTestimonial);
  localStorage.setItem('adminTestimonials', JSON.stringify(testimonials));

  // Clear form
  document.getElementById('testimonialName').value = '';
  document.getElementById('testimonialPosition').value = '';
  document.getElementById('testimonialRating').value = '5';
  document.getElementById('testimonialText').value = '';

  showMessage('success', 'Testimonial added successfully!');
  loadTestimonials();
}

function loadTestimonials() {
  const testimonials = JSON.parse(localStorage.getItem('adminTestimonials')) || [];
  const testimonialsList = document.getElementById('testimonialsList');

  if (testimonials.length === 0) {
    testimonialsList.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No custom testimonials yet. Add one above!</td></tr>';
    return;
  }

  let html = '';
  testimonials.forEach(testimonial => {
    const preview = testimonial.text.substring(0, 40) + '...';
    const stars = '⭐'.repeat(testimonial.rating);
    html += `
      <tr>
        <td>${testimonial.name}</td>
        <td>${testimonial.position}</td>
        <td>${stars}</td>
        <td>${preview}</td>
        <td>
          <button class="admin-button" style="padding: 0.5rem 1rem; margin-right: 0.5rem; cursor: pointer;" onclick="openEditTestimonialModal(${testimonial.id})">✏️ Edit</button>
          <button class="admin-button danger" style="padding: 0.5rem 1rem; margin: 0; cursor: pointer;" onclick="deleteTestimonial(${testimonial.id})">Delete</button>
        </td>
      </tr>
    `;
  });

  testimonialsList.innerHTML = html;
}

// Global variable to store the current testimonial being edited
let currentEditingTestimonialId = null;

function openEditTestimonialModal(id) {
  const testimonials = JSON.parse(localStorage.getItem('adminTestimonials')) || [];
  const testimonial = testimonials.find(t => t.id === id);

  if (!testimonial) {
    showMessage('error', 'Testimonial not found');
    return;
  }

  // Set current editing ID
  currentEditingTestimonialId = id;

  // Populate form fields
  document.getElementById('editTestimonialName').value = testimonial.name;
  document.getElementById('editTestimonialPosition').value = testimonial.position;
  document.getElementById('editTestimonialRating').value = testimonial.rating;
  document.getElementById('editTestimonialText').value = testimonial.text;

  // Show modal
  document.getElementById('editTestimonialModal').style.display = 'flex';
}

function closeEditTestimonialModal() {
  document.getElementById('editTestimonialModal').style.display = 'none';
  currentEditingTestimonialId = null;
}

function updateTestimonial() {
  if (!currentEditingTestimonialId) {
    showMessage('error', 'No testimonial selected');
    return;
  }

  const name = document.getElementById('editTestimonialName').value.trim();
  const position = document.getElementById('editTestimonialPosition').value.trim();
  const rating = document.getElementById('editTestimonialRating').value;
  const text = document.getElementById('editTestimonialText').value.trim();

  if (!name || !position || !text) {
    showMessage('error', 'Please fill all fields');
    return;
  }

  // Validate name length
  if (name.length > 100) {
    showMessage('error', 'Student name must be less than 100 characters');
    return;
  }

  // Validate position length
  if (position.length > 100) {
    showMessage('error', 'Position/Class must be less than 100 characters');
    return;
  }

  // Validate text length
  if (text.length > 1000) {
    showMessage('error', 'Testimonial text must be less than 1000 characters');
    return;
  }

  // Get testimonials from localStorage
  let testimonials = JSON.parse(localStorage.getItem('adminTestimonials')) || [];

  // Find and update the testimonial
  const index = testimonials.findIndex(t => t.id === currentEditingTestimonialId);
  if (index !== -1) {
    testimonials[index] = {
      ...testimonials[index],
      name: name,
      position: position,
      rating: parseInt(rating),
      text: text,
      updatedAt: new Date().toLocaleDateString()
    };

    localStorage.setItem('adminTestimonials', JSON.stringify(testimonials));
    showMessage('success', 'Testimonial updated successfully!');
    closeEditTestimonialModal();
    loadTestimonials();
  } else {
    showMessage('error', 'Failed to update testimonial');
  }
}

function deleteTestimonial(id) {
  if (!confirm('Are you sure you want to delete this testimonial?')) return;

  let testimonials = JSON.parse(localStorage.getItem('adminTestimonials')) || [];
  testimonials = testimonials.filter(t => t.id !== id);
  localStorage.setItem('adminTestimonials', JSON.stringify(testimonials));

  showMessage('success', 'Testimonial deleted successfully!');
  loadTestimonials();
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('editTestimonialModal');
  if (event.target === modal) {
    closeEditTestimonialModal();
  }
});

// STATISTICS MANAGEMENT
function updateStatistics() {
  const stats = {
    students: document.getElementById('statStudents').value || '50,000+',
    instructors: document.getElementById('statInstructors').value || '200+',
    videos: document.getElementById('statVideos').value || '1000+',
    success: document.getElementById('statSuccess').value || '95%'
  };

  // Validate each field is not too long
  for (const [key, value] of Object.entries(stats)) {
    if (value.length > 50) {
      showMessage('error', 'Statistics values must be less than 50 characters');
      return;
    }
  }

  localStorage.setItem('adminStatistics', JSON.stringify(stats));
  showMessage('success', 'Statistics updated successfully!');
}

// ABOUT SECTION MANAGEMENT
function updateAboutSection() {
  const aboutData = {
    story: document.getElementById('aboutStory').value.trim(),
    mission: document.getElementById('aboutMission').value.trim(),
    vision: document.getElementById('aboutVision').value.trim(),
    founderName: document.getElementById('founderName').value.trim(),
    founderTitle: document.getElementById('founderTitle').value.trim(),
    founderImage: founderImageData || '',
    updates: document.getElementById('aboutUpdates').value.trim(),
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem('adminAbout', JSON.stringify(aboutData));
  showMessage('success', 'About section updated successfully!');
}

function loadAboutSection() {
  const savedData = localStorage.getItem('adminAbout');
  
  if (savedData) {
    try {
      const aboutData = JSON.parse(savedData);
      document.getElementById('aboutStory').value = aboutData.story || '';
      document.getElementById('aboutMission').value = aboutData.mission || '';
      document.getElementById('aboutVision').value = aboutData.vision || '';
      document.getElementById('founderName').value = aboutData.founderName || '';
      document.getElementById('founderTitle').value = aboutData.founderTitle || '';
      document.getElementById('aboutUpdates').value = aboutData.updates || '';
      
      // Load founder image if it exists
      if (aboutData.founderImage) {
        founderImageData = aboutData.founderImage;
        const previewDiv = document.getElementById('founderImagePreview');
        if (previewDiv) {
          previewDiv.innerHTML = `
            <img src="${aboutData.founderImage}" alt="Founder" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 10px;">
            <p style="margin-top: 10px; color: #00b386;">✓ Image Loaded</p>
          `;
        }
      }
    } catch (error) {
      console.error('Error loading about section data:', error);
    }
  } else {
    // Set default values if no data exists
    document.getElementById('aboutStory').value = '';
    document.getElementById('aboutMission').value = '';
    document.getElementById('aboutVision').value = '';
    document.getElementById('founderName').value = '';
    document.getElementById('founderTitle').value = '';
    document.getElementById('aboutUpdates').value = '';
    founderImageData = '';
  }
}

// CONTACT MANAGEMENT
function updateContact() {
  const contact = {
    email: document.getElementById('contactEmail').value.trim(),
    partnershipEmail: document.getElementById('contactPartnershipEmail').value.trim(),
    phone: document.getElementById('contactPhone').value.trim(),
    hours: document.getElementById('contactHours').value.trim(),
    addressLine1: document.getElementById('contactAddressLine1').value.trim(),
    addressLine2: document.getElementById('contactAddressLine2').value.trim(),
    locationDesc: document.getElementById('contactLocationDesc').value.trim(),
    hoursDetails: document.getElementById('contactHoursDetails').value.trim(),
    lastUpdated: new Date().toLocaleDateString()
  };

  if (!contact.email || !contact.phone || !contact.addressLine1 || !contact.addressLine2) {
    showMessage('error', 'Please fill all required contact fields');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contact.email)) {
    showMessage('error', 'Please enter a valid email address');
    return;
  }

  // Validate partnership email if provided
  if (contact.partnershipEmail && !emailRegex.test(contact.partnershipEmail)) {
    showMessage('error', 'Please enter a valid partnership email address');
    return;
  }

  // Validate phone format
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
  if (!phoneRegex.test(contact.phone)) {
    showMessage('error', 'Please enter a valid phone number');
    return;
  }

  localStorage.setItem('adminContact', JSON.stringify(contact));
  showMessage('success', 'Contact information updated successfully!');
  loadContact();
}

function loadContact() {
  const contact = JSON.parse(localStorage.getItem('adminContact')) || {};
  
  // Load form fields
  document.getElementById('contactEmail').value = contact.email || '';
  document.getElementById('contactPartnershipEmail').value = contact.partnershipEmail || '';
  document.getElementById('contactPhone').value = contact.phone || '';
  document.getElementById('contactHours').value = contact.hours || 'Monday to Friday, 9:00 AM - 6:00 PM IST';
  document.getElementById('contactAddressLine1').value = contact.addressLine1 || '';
  document.getElementById('contactAddressLine2').value = contact.addressLine2 || '';
  document.getElementById('contactLocationDesc').value = contact.locationDesc || '';
  document.getElementById('contactHoursDetails').value = contact.hoursDetails || '';
  
  // Display current values
  document.getElementById('displayContactEmail').textContent = contact.email || '-';
  document.getElementById('displayContactPartnershipEmail').textContent = contact.partnershipEmail || '-';
  document.getElementById('displayContactPhone').textContent = contact.phone || '-';
  document.getElementById('displayContactHours').textContent = contact.hours || '-';
  document.getElementById('displayContactAddress').textContent = (contact.addressLine1 ? contact.addressLine1 + ', ' : '') + (contact.addressLine2 || '-');
}

// CONTENT MANAGEMENT
function updateContent() {
  const siteName = document.getElementById('siteName').value.trim();
  const tagline = document.getElementById('siteTagline').value.trim();
  const description = document.getElementById('siteDescription').value.trim();

  if (!siteName) {
    showMessage('error', 'Website name cannot be empty');
    return;
  }

  // Validate lengths
  if (siteName.length > 100) {
    showMessage('error', 'Website name must be less than 100 characters');
    return;
  }

  if (tagline.length > 200) {
    showMessage('error', 'Tagline must be less than 200 characters');
    return;
  }

  if (description.length > 1000) {
    showMessage('error', 'Description must be less than 1000 characters');
    return;
  }

  const content = {
    name: siteName,
    tagline: tagline,
    description: description
  };

  localStorage.setItem('adminContent', JSON.stringify(content));
  showMessage('success', 'Content updated successfully! Refresh pages to see changes.');
}

// PASSWORD MANAGEMENT
function changePassword() {
  const newPass = document.getElementById('newPassword').value;
  const confirmPass = document.getElementById('confirmPassword').value;

  if (!newPass || !confirmPass) {
    showMessage('error', 'Please enter password in both fields');
    return;
  }

  if (newPass !== confirmPass) {
    showMessage('error', 'Passwords do not match');
    return;
  }

  if (newPass.length < 6) {
    showMessage('error', 'Password must be at least 6 characters');
    return;
  }

  // Prevent whitespace-only passwords
  if (!/\S/.test(newPass)) {
    showMessage('error', 'Password cannot be empty or only whitespace');
    return;
  }

  // Get current username
  const currentUsername = localStorage.getItem('admin_username') || 'admin';

  // Update password in both storage keys for consistency
  localStorage.setItem('admin_password', newPass);
  localStorage.setItem('adminPassword', newPass);
  
  // Update credentials object
  const adminCreds = {
    username: currentUsername,
    password: newPass,
    changedDate: new Date().toLocaleDateString()
  };
  localStorage.setItem('adminCredentials', JSON.stringify(adminCreds));

  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';

  loadSettingsDisplay();
  showMessage('success', '✓ Password changed successfully! You will need to login again.');
  setTimeout(() => {
    handleAdminLogout();
  }, 2500);
}

// USERNAME MANAGEMENT
function changeUsername() {
  const newUsername = document.getElementById('newUsername').value.trim();

  if (!newUsername) {
    showMessage('error', 'Please enter a new username');
    return;
  }

  if (newUsername.length < 3) {
    showMessage('error', 'Username must be at least 3 characters');
    return;
  }

  // Validate username contains only alphanumeric and underscore
  if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    showMessage('error', 'Username can only contain letters, numbers, and underscores');
    return;
  }

  // Get current password (use default if not set)
  let currentPassword = localStorage.getItem('admin_password');
  if (!currentPassword) {
    currentPassword = 'admin123';
    localStorage.setItem('admin_password', currentPassword);
  }

  // Update username in both storage keys for consistency
  localStorage.setItem('admin_username', newUsername);
  localStorage.setItem('adminUsername', newUsername);
  
  // Update credentials object
  const adminCreds = {
    username: newUsername,
    password: currentPassword,
    changedDate: new Date().toLocaleDateString()
  };
  localStorage.setItem('adminCredentials', JSON.stringify(adminCreds));

  document.getElementById('newUsername').value = '';

  loadSettingsDisplay();
  showMessage('success', '✓ Username changed successfully! You will need to login again.');
  setTimeout(() => {
    handleAdminLogout();
  }, 2500);
}

// SECURITY QUESTION MANAGEMENT
function setSecurityQuestion() {
  const question = document.getElementById('securityQuestion').value;
  const answer = document.getElementById('securityAnswer').value.trim();

  if (!question) {
    showMessage('error', 'Please select a security question');
    return;
  }

  if (!answer) {
    showMessage('error', 'Please enter an answer');
    return;
  }

  if (answer.length < 2) {
    showMessage('error', 'Answer must be at least 2 characters');
    return;
  }

  // Store security question and answer
  const securityInfo = {
    question: question,
    answer: answer.toLowerCase().trim(),
    setDate: new Date().toLocaleDateString()
  };
  localStorage.setItem('adminSecurityQuestion', JSON.stringify(securityInfo));

  document.getElementById('securityQuestion').value = '';
  document.getElementById('securityAnswer').value = '';

  showMessage('success', '✓ Security question saved successfully!');
}

// LOAD SETTINGS DISPLAY
function loadSettingsDisplay() {
  const adminUsername = localStorage.getItem('admin_username') || 'admin';
  const adminPassword = localStorage.getItem('admin_password') || 'admin123';
  const credentials = JSON.parse(localStorage.getItem('adminCredentials')) || {};
  
  document.getElementById('displayAdminUsername').textContent = adminUsername;
  document.getElementById('displayAdminPassword').textContent = '••••••••';
  document.getElementById('displayCredentialsDate').textContent = credentials.changedDate || 'Never';
  
  // Pre-fill current username
  document.getElementById('currentUsername').value = adminUsername;
  
  // Load theme colors
  loadThemeColors();
}

// TOGGLE PASSWORD VISIBILITY
function togglePasswordVisibility(event) {
  event.preventDefault();
  const displayEl = document.getElementById('displayAdminPassword');
  const link = event.target;
  
  if (displayEl.textContent === '••••••••') {
    const password = localStorage.getItem('admin_password') || 'admin123';
    displayEl.textContent = password;
    link.textContent = '[Hide]';
  } else {
    displayEl.textContent = '••••••••';
    link.textContent = '[Show]';
  }
}

// DATA MANAGEMENT
function resetAllData() {
  if (!confirm('Are you sure? This will reset ALL custom data to default values. This cannot be undone!')) {
    return;
  }

  if (!confirm('Are you REALLY sure? Click OK to reset everything.')) {
    return;
  }

  // Clear all admin data
  localStorage.removeItem('adminCourses');
  localStorage.removeItem('adminTestimonials');
  localStorage.removeItem('adminStatistics');
  localStorage.removeItem('adminContact');
  localStorage.removeItem('adminContent');

  showMessage('success', 'All data has been reset to defaults!');
  location.reload();
}

function exportData() {
  const data = {
    courses: JSON.parse(localStorage.getItem('adminCourses')) || [],
    testimonials: JSON.parse(localStorage.getItem('adminTestimonials')) || [],
    statistics: JSON.parse(localStorage.getItem('adminStatistics')) || {},
    contact: JSON.parse(localStorage.getItem('adminContact')) || {},
    content: JSON.parse(localStorage.getItem('adminContent')) || {},
    exportDate: new Date().toLocaleString()
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `DS_EDUTECH_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showMessage('success', 'Data exported successfully!');
}

// LOGOUT
function handleAdminLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    localStorage.removeItem('admin_username_display');
    window.location.replace('admin-login-v2.html');
  }
}

// Load all data on page load
function loadAllData() {
  // Load statistics
  const stats = JSON.parse(localStorage.getItem('adminStatistics')) || {
    students: '50,000+',
    instructors: '200+',
    videos: '1000+',
    success: '95%'
  };
  if (document.getElementById('statStudents')) document.getElementById('statStudents').value = stats.students;
  if (document.getElementById('statInstructors')) document.getElementById('statInstructors').value = stats.instructors;
  if (document.getElementById('statVideos')) document.getElementById('statVideos').value = stats.videos;
  if (document.getElementById('statSuccess')) document.getElementById('statSuccess').value = stats.success;

  // Load contact info
  const contact = JSON.parse(localStorage.getItem('adminContact')) || {
    email: 'support@dsedutech.com',
    phone: '+91 8000-123-456',
    address: 'Bangalore, India - 560001'
  };
  if (document.getElementById('contactEmail')) document.getElementById('contactEmail').value = contact.email;
  if (document.getElementById('contactPhone')) document.getElementById('contactPhone').value = contact.phone;
  if (document.getElementById('contactAddress')) document.getElementById('contactAddress').value = contact.address;

  // Load content
  const content = JSON.parse(localStorage.getItem('adminContent')) || {
    name: 'DS_EDUTECH',
    tagline: 'Smart Learning for a Digital Future',
    description: ''
  };
  if (document.getElementById('siteName')) document.getElementById('siteName').value = content.name;
  if (document.getElementById('siteTagline')) document.getElementById('siteTagline').value = content.tagline;
  if (document.getElementById('siteDescription')) document.getElementById('siteDescription').value = content.description;

  // Load courses and testimonials
  loadCourses();
  loadTestimonials();
}

// Hero Section Functions
function updateHero() {
  const title = document.getElementById('heroTitle').value.trim();
  const subtitle = document.getElementById('heroSubtitle').value.trim();
  const primaryButton = document.getElementById('heroPrimaryButton').value.trim();
  const secondaryButton = document.getElementById('heroSecondaryButton').value.trim();

  // Validation - check if empty
  if (!title || !subtitle || !primaryButton || !secondaryButton) {
    showMessage('error', 'Please fill in all hero fields');
    return;
  }

  // Length validations
  if (title.length > 150) {
    showMessage('error', 'Hero title must be less than 150 characters');
    return;
  }

  if (subtitle.length > 500) {
    showMessage('error', 'Hero subtitle must be less than 500 characters');
    return;
  }

  if (primaryButton.length > 50) {
    showMessage('error', 'Button text must be less than 50 characters');
    return;
  }

  if (secondaryButton.length > 50) {
    showMessage('error', 'Button text must be less than 50 characters');
    return;
  }

  const hero = {
    title: title,
    subtitle: subtitle,
    primaryButtonText: primaryButton,
    secondaryButtonText: secondaryButton,
    lastUpdated: new Date().toLocaleDateString()
  };

  // Save to localStorage
  localStorage.setItem('adminHero', JSON.stringify(hero));
  
  // Refresh the display
  loadHero();
  showMessage('success', '✅ Hero section updated successfully! Changes will appear on your homepage.');
}

function loadHero() {
  // Get from localStorage with fallback to defaults
  const defaultHero = {
    title: 'Smart Learning for a Digital Future',
    subtitle: 'Master Science and Arts subjects with our interactive platform. Access high-quality courses, live classes, and expert guidance anytime, anywhere.',
    primaryButtonText: 'Start Learning Today',
    secondaryButtonText: 'Explore More'
  };

  const hero = JSON.parse(localStorage.getItem('adminHero')) || defaultHero;

  // Populate form fields
  document.getElementById('heroTitle').value = hero.title;
  document.getElementById('heroSubtitle').value = hero.subtitle;
  document.getElementById('heroPrimaryButton').value = hero.primaryButtonText;
  document.getElementById('heroSecondaryButton').value = hero.secondaryButtonText;

  // Update display section
  document.getElementById('displayHeroTitle').textContent = hero.title;
  document.getElementById('displayHeroSubtitle').textContent = hero.subtitle;
  document.getElementById('displayHeroPrimaryButton').textContent = hero.primaryButtonText;
  document.getElementById('displayHeroSecondaryButton').textContent = hero.secondaryButtonText;
}

// THEME COLOR MANAGEMENT
const DEFAULT_COLORS = {
  primary: '#0066cc',
  secondary: '#00b386'
};

function loadThemeColors() {
  const savedTheme = JSON.parse(localStorage.getItem('adminThemeColors')) || DEFAULT_COLORS;
  
  document.getElementById('primaryColor').value = savedTheme.primary;
  document.getElementById('primaryColorText').value = savedTheme.primary;
  document.getElementById('secondaryColor').value = savedTheme.secondary;
  document.getElementById('secondaryColorText').value = savedTheme.secondary;
  
  // Update display
  document.getElementById('displayPrimary').textContent = savedTheme.primary;
  document.getElementById('displaySecondary').textContent = savedTheme.secondary;
}

function syncColorPickerText(colorType) {
  if (colorType === 'primary') {
    const textValue = document.getElementById('primaryColorText').value.trim();
    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(textValue)) {
      document.getElementById('primaryColor').value = textValue;
      document.getElementById('displayPrimary').textContent = textValue;
    } else {
      showMessage('error', 'Invalid color format. Use #RRGGBB format');
      loadThemeColors();
    }
  } else if (colorType === 'secondary') {
    const textValue = document.getElementById('secondaryColorText').value.trim();
    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(textValue)) {
      document.getElementById('secondaryColor').value = textValue;
      document.getElementById('displaySecondary').textContent = textValue;
    } else {
      showMessage('error', 'Invalid color format. Use #RRGGBB format');
      loadThemeColors();
    }
  }
}

// Update colors when color picker changes
document.addEventListener('DOMContentLoaded', function() {
  const primaryColorInput = document.getElementById('primaryColor');
  const secondaryColorInput = document.getElementById('secondaryColor');
  
  if (primaryColorInput) {
    primaryColorInput.addEventListener('input', function() {
      document.getElementById('primaryColorText').value = this.value;
      document.getElementById('displayPrimary').textContent = this.value;
    });
  }
  
  if (secondaryColorInput) {
    secondaryColorInput.addEventListener('input', function() {
      document.getElementById('secondaryColorText').value = this.value;
      document.getElementById('displaySecondary').textContent = this.value;
    });
  }
});

function applyThemeColors() {
  const primaryColor = document.getElementById('primaryColor').value;
  const secondaryColor = document.getElementById('secondaryColor').value;
  
  // Validate colors
  if (!primaryColor || !secondaryColor) {
    showMessage('error', 'Please select both colors');
    return;
  }
  
  if (primaryColor === secondaryColor) {
    showMessage('error', 'Primary and secondary colors must be different');
    return;
  }

  // Save to localStorage
  const themeColors = {
    primary: primaryColor,
    secondary: secondaryColor,
    appliedDate: new Date().toLocaleDateString(),
    appliedTime: new Date().toLocaleTimeString()
  };
  
  localStorage.setItem('adminThemeColors', JSON.stringify(themeColors));
  
  // Apply to CSS variables immediately
  applyThemeToPage(primaryColor, secondaryColor);
  
  loadThemeColors();
  showMessage('success', '✓ Theme colors applied successfully! Changes will appear across the website.');
}

function applyThemeToPage(primaryColor, secondaryColor) {
  document.documentElement.style.setProperty('--primary-color', primaryColor);
  document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}

function resetThemeColors() {
  if (!confirm('Are you sure you want to reset to default theme colors?')) {
    return;
  }

  // Clear from localStorage
  localStorage.removeItem('adminThemeColors');
  
  // Reset CSS variables to defaults
  applyThemeToPage(DEFAULT_COLORS.primary, DEFAULT_COLORS.secondary);
  
  // Reload display
  loadThemeColors();
  
  showMessage('success', '↺ Theme colors reset to default! Refresh the page to see changes across all pages.');
  
  // Reload page after 2 seconds
  setTimeout(() => {
    location.reload();
  }, 2000);
}

// TEXT STYLING MANAGEMENT
const textStyleState = {
  section: '',
  color: '#333333',
  size: '16',
  bold: false,
  italic: false,
  underline: false,
  alignment: 'left',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const SECTION_SELECTORS = {
  hero: '.hero, .hero-content, .hero h1, .hero p',
  courses: '.subjects, .subject-card, .subject-card h3, .subject-card p',
  about: '.about, .about-section, .about h2, .about p',
  contact: '.contact, .contact-section, .contact h2, .contact p',
  testimonials: '.testimonials, .testimonial-item, .testimonial-item h3, .testimonial-item p',
  header: 'header, nav, .nav-links a, .logo',
  footer: 'footer, .footer-content, .footer-section, .footer-section a'
};

function loadSectionTextStyles() {
  const section = document.getElementById('textSectionSelect').value;
  
  if (!section) {
    document.getElementById('textStylesContainer').style.display = 'none';
    return;
  }

  textStyleState.section = section;
  document.getElementById('textStylesContainer').style.display = 'block';

  // Load saved styles for this section or use defaults
  const savedStyles = JSON.parse(localStorage.getItem(`textStyles_${section}`)) || {
    color: '#333333',
    size: '16',
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  // Update state and UI
  textStyleState.color = savedStyles.color;
  textStyleState.size = savedStyles.size;
  textStyleState.bold = savedStyles.bold;
  textStyleState.italic = savedStyles.italic;
  textStyleState.underline = savedStyles.underline;
  textStyleState.alignment = savedStyles.alignment;
  textStyleState.fontFamily = savedStyles.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

  // Update form inputs
  document.getElementById('textColor').value = savedStyles.color;
  document.getElementById('textColorHex').value = savedStyles.color;
  document.getElementById('textSize').value = savedStyles.size;
  document.getElementById('textSizeDisplay').textContent = savedStyles.size + 'px';
  document.getElementById('textAlignment').value = savedStyles.alignment;
  document.getElementById('fontFamily').value = savedStyles.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

  // Update style buttons
  updateStyleButtons();
  updatePreview();
}

function toggleStyle(style) {
  textStyleState[style] = !textStyleState[style];
  updateStyleButtons();
  updatePreview();
}

function updateStyleButtons() {
  const boldBtn = document.getElementById('boldBtn');
  const italicBtn = document.getElementById('italicBtn');
  const underlineBtn = document.getElementById('underlineBtn');

  boldBtn.style.background = textStyleState.bold ? 'var(--primary-color)' : 'white';
  boldBtn.style.color = textStyleState.bold ? 'white' : '#333';
  boldBtn.style.borderColor = textStyleState.bold ? 'var(--primary-color)' : '#e0e0e0';

  italicBtn.style.background = textStyleState.italic ? 'var(--primary-color)' : 'white';
  italicBtn.style.color = textStyleState.italic ? 'white' : '#333';
  italicBtn.style.borderColor = textStyleState.italic ? 'var(--primary-color)' : '#e0e0e0';

  underlineBtn.style.background = textStyleState.underline ? 'var(--primary-color)' : 'white';
  underlineBtn.style.color = textStyleState.underline ? 'white' : '#333';
  underlineBtn.style.borderColor = textStyleState.underline ? 'var(--primary-color)' : '#e0e0e0';
}

function updatePreview() {
  const preview = document.getElementById('textStylePreview');
  preview.style.color = textStyleState.color;
  preview.style.fontSize = textStyleState.size + 'px';
  preview.style.fontWeight = textStyleState.bold ? 'bold' : 'normal';
  preview.style.fontStyle = textStyleState.italic ? 'italic' : 'normal';
  preview.style.textDecoration = textStyleState.underline ? 'underline' : 'none';
  preview.style.textAlign = textStyleState.alignment;
  preview.style.fontFamily = textStyleState.fontFamily;
}

function updateFontPreview() {
  textStyleState.fontFamily = document.getElementById('fontFamily').value;
  updatePreview();
}

// Sync color input with text field
document.addEventListener('DOMContentLoaded', function() {
  const colorInput = document.getElementById('textColor');
  const colorHexInput = document.getElementById('textColorHex');
  const sizeInput = document.getElementById('textSize');
  const sizeDisplay = document.getElementById('textSizeDisplay');

  if (colorInput) {
    colorInput.addEventListener('input', function() {
      textStyleState.color = this.value;
      if (colorHexInput) colorHexInput.value = this.value;
      updatePreview();
    });
  }

  if (colorHexInput) {
    colorHexInput.addEventListener('change', function() {
      if (/^#[0-9A-F]{6}$/i.test(this.value)) {
        textStyleState.color = this.value;
        if (colorInput) colorInput.value = this.value;
        updatePreview();
      }
    });
  }

  if (sizeInput) {
    sizeInput.addEventListener('input', function() {
      textStyleState.size = this.value;
      if (sizeDisplay) sizeDisplay.textContent = this.value + 'px';
      updatePreview();
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const alignmentSelect = document.getElementById('textAlignment');
  if (alignmentSelect) {
    alignmentSelect.addEventListener('change', function() {
      textStyleState.alignment = this.value;
      updatePreview();
    });
  }
});

function applyTextStyles() {
  if (!textStyleState.section) {
    showMessage('error', 'Please select a section');
    return;
  }

  // Save to localStorage
  const styles = {
    color: textStyleState.color,
    size: textStyleState.size,
    bold: textStyleState.bold,
    italic: textStyleState.italic,
    underline: textStyleState.underline,
    alignment: textStyleState.alignment,
    fontFamily: textStyleState.fontFamily,
    appliedDate: new Date().toLocaleDateString()
  };

  localStorage.setItem(`textStyles_${textStyleState.section}`, JSON.stringify(styles));

  // Apply styles immediately
  applyTextStylesToPage(textStyleState.section);

  showMessage('success', `✓ Text styles applied to ${document.querySelector(`#textSectionSelect option[value="${textStyleState.section}"]`).textContent.trim()}!`);
}

function applyTextStylesToPage(section) {
  const styles = JSON.parse(localStorage.getItem(`textStyles_${section}`));
  if (!styles) return;

  const selectors = SECTION_SELECTORS[section];
  if (!selectors) return;

  // Create or update style tag
  let styleTag = document.getElementById(`textStyle_${section}`);
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = `textStyle_${section}`;
    document.head.appendChild(styleTag);
  }

  let cssRule = `${selectors} { color: ${styles.color} !important; font-size: ${styles.size}px !important; font-family: ${styles.fontFamily} !important;`;
  
  if (styles.bold) cssRule += ' font-weight: bold !important;';
  if (styles.italic) cssRule += ' font-style: italic !important;';
  if (styles.underline) cssRule += ' text-decoration: underline !important;';
  
  cssRule += ` text-align: ${styles.alignment} !important; }`;

  styleTag.innerHTML = cssRule;
}

function resetTextStyles() {
  if (!textStyleState.section) {
    showMessage('error', 'Please select a section');
    return;
  }

  if (!confirm(`Reset text styles for this section?`)) {
    return;
  }

  // Remove from localStorage
  localStorage.removeItem(`textStyles_${textStyleState.section}`);

  // Remove style tag
  const styleTag = document.getElementById(`textStyle_${textStyleState.section}`);
  if (styleTag) {
    styleTag.remove();
  }

  // Reset form
  loadSectionTextStyles();

  showMessage('success', '↺ Text styles reset for this section!');
}

// Apply all saved text styles on page load
function applyAllSavedTextStyles() {
  Object.keys(SECTION_SELECTORS).forEach(section => {
    applyTextStylesToPage(section);
  });
}

// ===== SECTION STYLING FUNCTIONS =====

// Shadow effect presets
const SHADOW_PRESETS = {
  none: 'none',
  light: '0 2px 8px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
  heavy: '0 8px 32px rgba(0, 0, 0, 0.2)'
};

// CSS selectors for sections
const SECTION_STYLING_SELECTORS = {
  hero: '.hero',
  courses: '.subjects',
  about: '.about',
  contact: '.contact',
  testimonials: '.testimonials',
  header: 'header',
  footer: 'footer'
};

// Section styling state
let sectionStyleState = {
  section: 'hero',
  bgColor: '#ffffff',
  borderColor: '#000000',
  borderWidth: 0,
  borderRadius: 0,
  shadow: 'none',
  padding: 20,
  opacity: 1
};

// Load section style from localStorage
function loadSectionStyle() {
  const section = document.getElementById('sectionSelector').value;
  sectionStyleState.section = section;

  const savedStyle = JSON.parse(localStorage.getItem(`sectionStyle_${section}`)) || {};
  const style = {
    bgColor: savedStyle.bgColor || '#ffffff',
    borderColor: savedStyle.borderColor || '#000000',
    borderWidth: savedStyle.borderWidth || 0,
    borderRadius: savedStyle.borderRadius || 0,
    shadow: savedStyle.shadow || 'none',
    padding: savedStyle.padding || 20,
    opacity: savedStyle.opacity || 1
  };

  // Update state
  Object.assign(sectionStyleState, style);

  // Update form fields
  document.getElementById('sectionBgColor').value = style.bgColor;
  document.getElementById('sectionBgColorHex').value = style.bgColor;
  document.getElementById('sectionBorderColor').value = style.borderColor;
  document.getElementById('sectionBorderColorHex').value = style.borderColor;
  document.getElementById('sectionBorderWidth').value = style.borderWidth;
  document.getElementById('sectionBorderRadius').value = style.borderRadius;
  document.getElementById('sectionShadow').value = style.shadow;
  document.getElementById('sectionPadding').value = style.padding;
  document.getElementById('sectionOpacity').value = style.opacity;

  // Update display values
  document.getElementById('borderWidthValue').textContent = style.borderWidth + 'px';
  document.getElementById('borderRadiusValue').textContent = style.borderRadius + 'px';
  document.getElementById('paddingValue').textContent = style.padding + 'px';
  document.getElementById('opacityValue').textContent = Math.round(style.opacity * 100) + '%';

  updateSectionStylePreview();
}

// Update preview of section style
function updateSectionStylePreview() {
  const bgColor = document.getElementById('sectionBgColor').value || document.getElementById('sectionBgColorHex').value;
  const borderColor = document.getElementById('sectionBorderColor').value || document.getElementById('sectionBorderColorHex').value;
  const borderWidth = document.getElementById('sectionBorderWidth').value;
  const borderRadius = document.getElementById('sectionBorderRadius').value;
  const shadow = document.getElementById('sectionShadow').value;
  const padding = document.getElementById('sectionPadding').value;
  const opacity = document.getElementById('sectionOpacity').value;

  // Update state
  sectionStyleState.bgColor = bgColor;
  sectionStyleState.borderColor = borderColor;
  sectionStyleState.borderWidth = parseInt(borderWidth);
  sectionStyleState.borderRadius = parseInt(borderRadius);
  sectionStyleState.shadow = shadow;
  sectionStyleState.padding = parseInt(padding);
  sectionStyleState.opacity = parseFloat(opacity);

  // Update display values
  document.getElementById('borderWidthValue').textContent = borderWidth + 'px';
  document.getElementById('borderRadiusValue').textContent = borderRadius + 'px';
  document.getElementById('paddingValue').textContent = padding + 'px';
  document.getElementById('opacityValue').textContent = Math.round(opacity * 100) + '%';

  // Apply preview
  const preview = document.getElementById('sectionStylePreview');
  preview.style.backgroundColor = bgColor;
  preview.style.borderColor = borderColor;
  preview.style.borderWidth = borderWidth + 'px';
  preview.style.borderStyle = borderWidth > 0 ? 'solid' : 'none';
  preview.style.borderRadius = borderRadius + 'px';
  preview.style.boxShadow = SHADOW_PRESETS[shadow];
  preview.style.padding = padding + 'px';
  preview.style.opacity = opacity;
}

// Apply section style
function applySectionStyle() {
  const section = sectionStyleState.section;
  const styles = {
    bgColor: sectionStyleState.bgColor,
    borderColor: sectionStyleState.borderColor,
    borderWidth: sectionStyleState.borderWidth,
    borderRadius: sectionStyleState.borderRadius,
    shadow: sectionStyleState.shadow,
    padding: sectionStyleState.padding,
    opacity: sectionStyleState.opacity,
    appliedDate: new Date().toISOString().split('T')[0],
    appliedTime: new Date().toLocaleTimeString()
  };

  localStorage.setItem(`sectionStyle_${section}`, JSON.stringify(styles));
  showMessage('success', `✓ Style applied to ${section} section!`);
  applySectionStyleToPage(section);
}

// Reset section style
function resetSectionStyle() {
  const section = sectionStyleState.section;
  localStorage.removeItem(`sectionStyle_${section}`);
  loadSectionStyle();
  
  // Remove style tag from page
  const styleTag = document.getElementById(`sectionStyle_${section}`);
  if (styleTag) styleTag.remove();
  
  showMessage('success', `↺ Style reset for ${section} section!`);
}

// Apply section style to page
function applySectionStyleToPage(section) {
  const styles = JSON.parse(localStorage.getItem(`sectionStyle_${section}`));
  if (!styles) return;

  const selector = SECTION_STYLING_SELECTORS[section];
  let styleTag = document.getElementById(`sectionStyle_${section}`);
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = `sectionStyle_${section}`;
    document.head.appendChild(styleTag);
  }

  let cssRule = `${selector} {
    background-color: ${styles.bgColor} !important;
    border: ${styles.borderWidth}px solid ${styles.borderColor} !important;
    border-radius: ${styles.borderRadius}px !important;
    box-shadow: ${SHADOW_PRESETS[styles.shadow]} !important;
    padding: ${styles.padding}px !important;
    opacity: ${styles.opacity} !important;
  }`;

  styleTag.innerHTML = cssRule;
}

// Apply all saved section styles on page load
function applyAllSavedSectionStyles() {
  Object.keys(SECTION_STYLING_SELECTORS).forEach(section => {
    applySectionStyleToPage(section);
  });
}

// ===== STUDENT RESULTS MANAGEMENT =====

// Global variable to store student photo data
let studentPhotoData = null;

// Preview result photo
function previewResultPhoto(input) {
  const previewDiv = document.getElementById('resultPhotoPreview');
  const statusDiv = document.getElementById('resultPhotoStatus');
  
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2); // in KB
    
    // Show filename
    statusDiv.innerHTML = `<strong>✓ File Selected:</strong> ${fileName} (${fileSize} KB)`;
    statusDiv.style.color = '#28a745';
    
    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      statusDiv.innerHTML = `<strong style="color: #dc3545;">✗ File too large:</strong> ${fileName} is ${fileSize} KB. Max allowed is 500 KB`;
      statusDiv.style.color = '#dc3545';
      previewDiv.innerHTML = '';
      input.value = '';
      studentPhotoData = null;
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        studentPhotoData = e.target.result;
        previewDiv.innerHTML = `<img src="${e.target.result}" style="max-width: 150px; max-height: 150px; border: 2px solid #00b386; border-radius: 8px; object-fit: cover;">`;
        statusDiv.innerHTML = `<strong style="color: #28a745;">✓ Photo Ready:</strong> ${fileName} is ready to upload`;
        statusDiv.style.color = '#28a745';
      } catch (error) {
        statusDiv.innerHTML = `<strong style="color: #dc3545;">✗ Error:</strong> Failed to process image`;
        statusDiv.style.color = '#dc3545';
        studentPhotoData = null;
      }
    };
    reader.readAsDataURL(file);
  } else {
    statusDiv.innerHTML = '';
    previewDiv.innerHTML = '';
    studentPhotoData = null;
  }
}

// Load all student results for admin display
function loadStudentResults() {
  const resultsList = document.getElementById('resultsList');
  if (!resultsList) return;
  
  // Get from localStorage (which syncs from Firebase)
  let studentResults = JSON.parse(localStorage.getItem('studentResults')) || [];
  
  if (studentResults.length === 0) {
    resultsList.innerHTML = '<p style="color: #999;">No student results added yet. Add one using the form above!</p>';
    return;
  }
  
  resultsList.innerHTML = studentResults.map((result, index) => `
    <div style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      ${result.photo ? `<img src="${result.photo}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 1rem;">` : ''}
      
      <h4 style="margin: 0.5rem 0; color: #333;">${result.studentName || 'N/A'}</h4>
      <p style="margin: 0.25rem 0; color: #666; font-size: 14px;">
        <strong>📍 School:</strong> ${result.school || 'N/A'}
      </p>
      <p style="margin: 0.25rem 0; color: #666; font-size: 14px;">
        <strong>📊 Marks:</strong> <span style="color: #4CAF50; font-weight: bold;">${result.marks}%</span>
      </p>
      <p style="margin: 0.25rem 0; color: #666; font-size: 14px;">
        <strong>📚 Board:</strong> ${result.board || 'N/A'}
      </p>
      <p style="margin: 0.5rem 0; color: #666; font-size: 14px;">
        <strong>🎓 Stream:</strong> ${result.stream || 'N/A'}
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem;">
        <button class="admin-button" onclick="editStudentResult(${index})" style="padding: 0.5rem; font-size: 13px;">✏️ Edit</button>
        <button class="admin-button" onclick="deleteStudentResult(${index})" style="padding: 0.5rem; font-size: 13px; background: #ff6b6b;">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

// Add new student result
function addStudentResult() {
  const studentName = document.getElementById('resultStudentName')?.value?.trim();
  const marks = document.getElementById('resultMarks')?.value;
  const school = document.getElementById('resultSchool')?.value?.trim();
  const board = document.getElementById('resultBoard')?.value?.trim();
  const stream = document.getElementById('resultStream')?.value?.trim();
  const photo = studentPhotoData || null;
  
  // Validation
  if (!studentName || !school || marks === '' || marks === null) {
    showMessage('error', 'Please fill in all required fields (Name, School, Marks)');
    return;
  }
  
  if (marks < 0 || marks > 100) {
    showMessage('error', 'Marks must be between 0 and 100');
    return;
  }
  
  // Create result object
  const newResult = {
    studentName,
    marks: parseInt(marks),
    school,
    board: board || 'N/A',
    stream: stream || 'N/A',
    photo: photo || null,
    addedDate: new Date().toLocaleString()
  };
  
  // Get existing results
  let studentResults = JSON.parse(localStorage.getItem('studentResults')) || [];
  
  // Add new result
  studentResults.push(newResult);
  
  // Save to localStorage (automatically syncs to Firebase)
  localStorage.setItem('studentResults', JSON.stringify(studentResults));
  
  // Clear form
  document.getElementById('resultStudentName').value = '';
  document.getElementById('resultMarks').value = '';
  document.getElementById('resultSchool').value = '';
  document.getElementById('resultBoard').value = '';
  document.getElementById('resultStream').value = '';
  document.getElementById('resultPhotoInput').value = '';
  document.getElementById('resultPhotoPreview').innerHTML = '';
  document.getElementById('resultPhotoStatus').innerHTML = '';
  studentPhotoData = null;
  
  showMessage('success', `✓ ${studentName} added successfully!`);
  
  // Reload list
  setTimeout(loadStudentResults, 500);
}

// Delete student result
function deleteStudentResult(index) {
  if (!confirm('Are you sure you want to delete this student result?')) {
    return;
  }
  
  let studentResults = JSON.parse(localStorage.getItem('studentResults')) || [];
  const deletedName = studentResults[index]?.studentName || 'Unknown';
  
  // Remove from array
  studentResults.splice(index, 1);
  
  // Save to localStorage
  localStorage.setItem('studentResults', JSON.stringify(studentResults));
  
  showMessage('success', `✓ ${deletedName} removed successfully!`);
  
  // Reload list
  setTimeout(loadStudentResults, 500);
}

// Edit student result (populate form)
function editStudentResult(index) {
  let studentResults = JSON.parse(localStorage.getItem('studentResults')) || [];
  const result = studentResults[index];
  
  if (!result) {
    showMessage('error', 'Result not found!');
    return;
  }
  
  // Populate form with existing data
  document.getElementById('resultStudentName').value = result.studentName || '';
  document.getElementById('resultMarks').value = result.marks || '';
  document.getElementById('resultSchool').value = result.school || '';
  document.getElementById('resultBoard').value = result.board || '';
  document.getElementById('resultStream').value = result.stream || '';
  
  // Display existing photo if it exists
  if (result.photo) {
    document.getElementById('resultPhotoPreview').innerHTML = `<img src="${result.photo}" style="max-width: 150px; max-height: 150px; border: 2px solid #00b386; border-radius: 8px; object-fit: cover;">`;
    document.getElementById('resultPhotoStatus').innerHTML = `<strong style="color: #28a745;">✓ Current Photo:</strong> Click to change`;
    studentPhotoData = result.photo;
  } else {
    document.getElementById('resultPhotoPreview').innerHTML = '';
    document.getElementById('resultPhotoStatus').innerHTML = '';
    studentPhotoData = null;
  }
  
  // Change button text to indicate editing
  const addButton = document.querySelector('button[onclick="addStudentResult()"]');
  const originalText = addButton.textContent;
  addButton.textContent = '💾 Update Result';
  
  // Store editing index
  window.editingResultIndex = index;
  
  // Change the onclick handler temporarily
  addButton.onclick = function() {
    updateStudentResult(index);
  };
  
  // Show success message
  showMessage('success', 'Editing mode - Update form and click "Update Result"');
  
  // Scroll to form
  document.querySelector('input[id="resultStudentName"]').scrollIntoView({ behavior: 'smooth' });
}

// Update existing student result
function updateStudentResult(index) {
  const studentName = document.getElementById('resultStudentName')?.value?.trim();
  const marks = document.getElementById('resultMarks')?.value;
  const school = document.getElementById('resultSchool')?.value?.trim();
  const board = document.getElementById('resultBoard')?.value?.trim();
  const stream = document.getElementById('resultStream')?.value?.trim();
  const photo = studentPhotoData || null;
  
  // Validation
  if (!studentName || !school || marks === '' || marks === null) {
    showMessage('error', 'Please fill in all required fields');
    return;
  }
  
  if (marks < 0 || marks > 100) {
    showMessage('error', 'Marks must be between 0 and 100');
    return;
  }
  
  let studentResults = JSON.parse(localStorage.getItem('studentResults')) || [];
  
  // Update result
  studentResults[index] = {
    ...studentResults[index],
    studentName,
    marks: parseInt(marks),
    school,
    board: board || 'N/A',
    stream: stream || 'N/A',
    photo: photo || studentResults[index].photo || null,
    updatedDate: new Date().toLocaleString()
  };
  
  // Save to localStorage
  localStorage.setItem('studentResults', JSON.stringify(studentResults));
  
  // Reset form
  document.getElementById('resultStudentName').value = '';
  document.getElementById('resultMarks').value = '';
  document.getElementById('resultSchool').value = '';
  document.getElementById('resultBoard').value = '';
  document.getElementById('resultStream').value = '';
  document.getElementById('resultPhotoInput').value = '';
  document.getElementById('resultPhotoPreview').innerHTML = '';
  document.getElementById('resultPhotoStatus').innerHTML = '';
  studentPhotoData = null;
  
  // Reset button
  const addButton = document.querySelector('button[onclick*="addStudentResult"]');
  addButton.textContent = '➕ Add Student Result';
  addButton.onclick = function() { addStudentResult(); };
  
  delete window.editingResultIndex;
  
  showMessage('success', `✓ ${studentName} updated successfully!`);
  
  // Reload list
  setTimeout(loadStudentResults, 500);
}

// Initialize menu navigation on page load
document.addEventListener('DOMContentLoaded', function() {
  // Setup menu click handlers
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the section ID from data attribute
      const sectionId = this.getAttribute('data-section');
      if (sectionId) {
        showSection(sectionId);
      }
    });
  });
  
  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleAdminLogout();
    });
  }
  
  // Load initial dashboard data
  loadAllData();
  
  // Apply saved styles
  setTimeout(applyAllSavedTextStyles, 100);
  setTimeout(applyAllSavedSectionStyles, 100);
});
