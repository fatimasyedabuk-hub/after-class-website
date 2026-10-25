// State variables remember choices and actions during this visit.
let energy = '';
let minutes = 0;
let currentOutcome = '';
let plansMade = 0;
let planAccepted = false;

const form = document.getElementById('plan-form');
const resultPanel = document.getElementById('result');
const acceptButton = document.getElementById('accept-button');
const message = document.getElementById('form-message');
const energyNames = { low: 'low energy', medium: 'some energy', high: 'high energy' };

// Three outcomes. The conditional function below chooses between these plans.
const plans = {
  recharge: {
    number: '01', label: 'RECHARGE', title: 'A soft landing.',
    description: 'You have done enough for now. Make the next part of your day quieter.',
    image: 'images/recharge.svg', alt: 'An armchair, a warm lamp, a mug, and a moonlit window.',
    sticker: 'REST IS A PLAN, TOO',
    steps: ['Put your bag down and get comfortable.', 'Make a drink and put your phone aside.', 'Read a few pages, listen to music, or simply rest.']
  },
  reset: {
    number: '02', label: 'QUICK RESET', title: 'A change of scenery.',
    description: 'A small break can feel like a fresh start. Keep it close, easy, and unhurried.',
    image: 'images/reset.svg', alt: 'A warm takeaway drink surrounded by green trees and sunshine.',
    sticker: 'A LITTLE BREAK GOES A LONG WAY',
    steps: ['Take a short walk somewhere familiar.', 'Bring a drink or stop somewhere nearby.', 'Enjoy a few minutes away from your usual screen.']
  },
  adventure: {
    number: '03', label: 'MINI ADVENTURE', title: 'Take the scenic route.',
    description: 'You have the time and energy for a little detour. Try somewhere beyond your usual routine.',
    image: 'images/adventure.svg', alt: 'A winding path through green hills, trees, and a golden sky.',
    sticker: 'SOMETHING NEW IS WAITING',
    steps: ['Pick a nearby park, neighbourhood, or gallery.', 'Leave enough time for the journey back.', 'Explore at your own pace and notice something new.']
  }
};

// The main decision uses if / else if / else, strict equality, and a number comparison.
// Low energy takes priority, regardless of how much time the visitor has.
function chooseOutcome(selectedEnergy, availableMinutes) {
  if (selectedEnergy === 'low') {
    return 'recharge';
  } else if (availableMinutes < 60) {
    return 'reset';
  } else {
    return 'adventure';
  }
}

function clearResult() {
  currentOutcome = '';
  planAccepted = false;
  resultPanel.dataset.outcome = 'waiting';
  document.getElementById('result-kicker').textContent = 'YOUR AFTER-CLASS EDIT';
  document.getElementById('result-number').textContent = '— / 03';
  document.getElementById('result-image').src = 'images/recharge.svg';
  document.getElementById('result-image').alt = 'An illustrated armchair beside a lamp and a window.';
  document.getElementById('result-sticker').textContent = "THERE'S NO WRONG ANSWER";
  document.getElementById('result-label').textContent = 'A MOMENT FOR YOU';
  document.getElementById('result-title').textContent = 'A plan that fits your day.';
  document.getElementById('result-description').textContent = 'Choose your energy and free time. Your next little moment starts here.';
  document.getElementById('result-reason').hidden = true;
  document.getElementById('plan-steps').hidden = true;
  acceptButton.hidden = true;
  acceptButton.disabled = false;
  document.getElementById('confirmation').textContent = '';
  document.getElementById('submit-label').textContent = 'Find my plan';
}

function showPlan(outcome) {
  const plan = plans[outcome];
  currentOutcome = outcome;
  planAccepted = false;
  plansMade += 1;
  resultPanel.dataset.outcome = outcome;
  document.getElementById('result-kicker').textContent = 'YOUR PLAN IS READY';
  document.getElementById('result-number').textContent = plan.number + ' / 03';
  document.getElementById('result-image').src = plan.image;
  document.getElementById('result-image').alt = plan.alt;
  document.getElementById('result-sticker').textContent = plan.sticker;
  document.getElementById('result-label').textContent = plan.label;
  document.getElementById('result-title').textContent = plan.title;
  document.getElementById('result-description').textContent = plan.description;
  const reason = document.getElementById('result-reason');
  reason.hidden = false;
  reason.textContent = 'Picked for you: ' + energyNames[energy] + ' + ' + minutes + ' free minutes.';
  const list = document.getElementById('plan-steps');
  list.replaceChildren();
  plan.steps.forEach(function (step) {
    const item = document.createElement('li');
    item.textContent = step;
    list.appendChild(item);
  });
  list.hidden = false;
  acceptButton.hidden = false;
  acceptButton.disabled = false;
  acceptButton.textContent = "That's my plan ✓";
  document.getElementById('confirmation').textContent = '';
  document.getElementById('submit-label').textContent = 'Find my plan again';
  document.getElementById('session-status').textContent = plansMade === 1
    ? '1 plan explored this visit. You can always change your mind.'
    : plansMade + ' plans explored this visit. You can always change your mind.';
  document.getElementById('result-title').focus({ preventScroll: true });
  if (window.innerWidth <= 700) {
    resultPanel.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
}

// Input changes update state and clear the old result so it cannot become stale.
form.addEventListener('change', function () {
  const selectedEnergy = form.querySelector('input[name="energy"]:checked');
  const selectedTime = form.querySelector('input[name="minutes"]:checked');
  energy = selectedEnergy ? selectedEnergy.value : '';
  minutes = selectedTime ? Number(selectedTime.value) : 0;
  message.textContent = '';
  clearResult();
});

form.addEventListener('submit', function (event) {
  event.preventDefault();
  // Validation is another conditional: both choices must exist before making a plan.
  if (energy === '' || minutes === 0) {
    message.textContent = 'Choose your energy and available time first.';
    const firstMissing = energy === '' ? 'input[name="energy"]' : 'input[name="minutes"]';
    form.querySelector(firstMissing).focus();
    return;
  }
  message.textContent = '';
  const outcome = chooseOutcome(energy, minutes);
  showPlan(outcome);
});

// A boolean prevents accepting the same result more than once.
acceptButton.addEventListener('click', function () {
  if (currentOutcome !== '' && planAccepted === false) {
    planAccepted = true;
    acceptButton.disabled = true;
    acceptButton.textContent = 'Plan chosen ✓';
    document.getElementById('confirmation').textContent = 'Settled: ' + plans[currentOutcome].label.toLowerCase() + '. Enjoy your time—you can come back and change it.';
  }
});

document.getElementById('reset-button').addEventListener('click', function () {
  form.reset();
  energy = '';
  minutes = 0;
  plansMade = 0;
  message.textContent = '';
  clearResult();
  document.getElementById('session-status').textContent = 'Your afternoon, your pace.';
  form.querySelector('input[name="energy"]').focus({ preventScroll: true });
});
