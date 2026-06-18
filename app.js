/**
 * What I Wish I Knew in Level 100 - Event Registration SPA Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const welcomeView = document.getElementById('welcome-view');
  const formView = document.getElementById('form-view');
  const successView = document.getElementById('success-view');

  const btnGoToRegister = document.getElementById('btn-go-to-register');
  const btnBackToWelcome = document.getElementById('btn-back-to-welcome');
  const btnRegisterAnother = document.getElementById('btn-register-another');

  // Form elements
  const form = document.getElementById('registration-form');
  const inputFullName = document.getElementById('input-fullname');
  const inputEmail = document.getElementById('input-email');
  const inputPhone = document.getElementById('input-phone');
  const selectCollege = document.getElementById('select-college');

  const btnSubmit = document.getElementById('btn-submit');
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnSubmitSpinner = document.getElementById('btn-submit-spinner');
  const formErrorBanner = document.getElementById('form-error-banner');
  const formErrorText = document.getElementById('form-error-text');

  // Google Apps Script Web App Endpoint URL
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbyftWrJiKiN4gNMCrZLyk4oNrk4cHUTd8stXSlPB_5XASRlYeBz7Mtk_9UM3D_6IUvG/exec';

  // --- View Switcher ---
  function showView(viewToShow) {
    // Hide all views first
    [welcomeView, formView, successView].forEach(view => {
      view.classList.add('hidden');
    });
    // Show target view
    viewToShow.classList.remove('hidden');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Navigation Event Listeners
  btnGoToRegister.addEventListener('click', () => showView(formView));
  btnBackToWelcome.addEventListener('click', () => {
    resetFormErrors();
    showView(welcomeView);
  });
  btnRegisterAnother.addEventListener('click', () => {
    form.reset();
    resetFormErrors();
    showView(formView);
  });

  // --- Live Validation Handlers ---
  const validationRules = {
    fullname: (value) => {
      return value.trim().length >= 2;
    },
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim());
    },
    phone: (value) => {
      // Remove spaces, hyphens, and parentheses
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      // Standard validation: numbers only, length between 9 and 15 digits (to support country codes)
      const phoneRegex = /^\+?[0-9]{9,15}$/;
      return phoneRegex.test(cleanPhone);
    },
    college: (value) => {
      return value !== '';
    }
  };

  function validateField(inputElement, ruleKey) {
    const value = inputElement.value;
    const isValid = validationRules[ruleKey](value);
    const formGroup = inputElement.closest('.form-group');

    if (isValid) {
      formGroup.classList.remove('has-error');
      inputElement.classList.remove('invalid');
    } else {
      formGroup.classList.add('has-error');
      inputElement.classList.add('invalid');
    }

    return isValid;
  }

  // Attach input event listeners for real-time validation feedback
  inputFullName.addEventListener('input', () => validateField(inputFullName, 'fullname'));
  inputEmail.addEventListener('input', () => validateField(inputEmail, 'email'));
  inputPhone.addEventListener('input', () => validateField(inputPhone, 'phone'));
  selectCollege.addEventListener('change', () => validateField(selectCollege, 'college'));

  function resetFormErrors() {
    formErrorBanner.classList.add('hidden');
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => input.classList.remove('invalid'));
  }

  // --- Form Submission Logic ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resetFormErrors();

    // Perform final check on all fields
    const isNameValid = validateField(inputFullName, 'fullname');
    const isEmailValid = validateField(inputEmail, 'email');
    const isPhoneValid = validateField(inputPhone, 'phone');
    const isCollegeValid = validateField(selectCollege, 'college');

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isCollegeValid) {
      // Find the first invalid element and focus it
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Set Loading State
    setLoadingState(true);

    // Prepare payload
    const formData = {
      // Name variations
      name: inputFullName.value.trim(),
      fullname: inputFullName.value.trim(),
      fullName: inputFullName.value.trim(),
      'Full Name': inputFullName.value.trim(),
      Name: inputFullName.value.trim(),

      // Email variations
      email: inputEmail.value.trim(),
      emailAddress: inputEmail.value.trim(),
      'Email Address': inputEmail.value.trim(),

      // Contact variations
      phone: inputPhone.value.trim(),
      phoneNumber: inputPhone.value.trim(),
      phone_number: inputPhone.value.trim(),
      number: inputPhone.value.trim(),
      contact: inputPhone.value.trim(),
      contactNumber: inputPhone.value.trim(),
      'Contact Number': inputPhone.value.trim(),
      Phone: inputPhone.value.trim(),
      Number: inputPhone.value.trim(),

      // College variations
      college: selectCollege.value,
      'KNUST College': selectCollege.value
    };

    try {
      // Send the request using mode: 'no-cors' as per requirements
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Since mode: 'no-cors' resolves immediately without access to response body/status,
      // we assume success if the fetch call doesn't throw.
      setLoadingState(false);
      showView(successView);

    } catch (error) {
      console.error('Registration submission error:', error);
      setLoadingState(false);
      
      // Display error banner to the user
      formErrorText.textContent = 'Network or connection error. Please verify your internet connection and try again.';
      formErrorBanner.classList.remove('hidden');
      formErrorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      btnSubmit.disabled = true;
      btnSubmitText.textContent = 'Registering Seat...';
      btnSubmitSpinner.classList.remove('hidden');
    } else {
      btnSubmit.disabled = false;
      btnSubmitText.textContent = 'Submit Registration';
      btnSubmitSpinner.classList.add('hidden');
    }
  }
});
