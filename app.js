// Example: Populate language dropdowns, handle swap, and character count
const srcLang = document.getElementById('srcLang');
const destLang = document.getElementById('destLang');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const inputCounter = document.getElementById('inputCounter');
const outputCounter = document.getElementById('outputCounter');
const swapBtn = document.getElementById('swapBtn');

// Populate language dropdowns (fetch from backend or use static list)
const languages = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  // ...add more
};
for (const [code, name] of Object.entries(languages)) {
  srcLang.innerHTML += `<option value="${code}">${name}</option>`;
  destLang.innerHTML += `<option value="${code}">${name}</option>`;
}
srcLang.value = 'en';
destLang.value = 'es';

// Swap languages
swapBtn.addEventListener('click', () => {
  const temp = srcLang.value;
  srcLang.value = destLang.value;
  destLang.value = temp;
  // Optionally swap text too
  // const tempText = inputText.value;
  // inputText.value = outputText.value;
  // outputText.value = tempText;
});

// Character counter
inputText.addEventListener('input', () => {
  inputCounter.textContent = `${inputText.value.length}/5000`;
});

// Form submit (AJAX to backend)
document.getElementById('translateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  // Add loading spinner here if desired
  const res = await fetch('/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      src: srcLang.value,
      dest: destLang.value,
      text: inputText.value
    })
  });
  const data = await res.json();
  outputText.value = data.translation || '';
  outputCounter.textContent = outputText.value.length;
});