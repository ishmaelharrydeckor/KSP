/**
 * Program Outline & Schedule - SPA Tab Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const tabSchedule = document.getElementById('tab-schedule');
  const tabSpeakers = document.getElementById('tab-speakers');
  const tabFlyer = document.getElementById('tab-flyer');

  const secSchedule = document.getElementById('schedule');
  const secSpeakers = document.getElementById('speakers');
  const secFlyer = document.getElementById('flyer');

  function showSection(sectionToShow, activeTab) {
    // Hide all sections
    [secSchedule, secSpeakers, secFlyer].forEach(sec => sec.classList.add('hidden'));
    // Remove active class from all tabs
    [tabSchedule, tabSpeakers, tabFlyer].forEach(tab => tab.classList.remove('active'));

    // Show selected section and mark tab as active
    sectionToShow.classList.remove('hidden');
    activeTab.classList.add('active');
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabSchedule.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(secSchedule, tabSchedule);
  });

  tabSpeakers.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(secSpeakers, tabSpeakers);
  });

  tabFlyer.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(secFlyer, tabFlyer);
  });
});
