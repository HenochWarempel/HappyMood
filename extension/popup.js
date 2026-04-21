const btn = document.getElementById("toggleBtn");
const label = document.getElementById("toggleLabel");
const icon = document.getElementById("toggleIcon");

let isActive = false;

function updateUI(active) {
  isActive = active;
  if (active) {
    btn.classList.add("active");
    label.textContent = "Checker uitzetten";
    icon.textContent = "■";
  } else {
    btn.classList.remove("active");
    label.textContent = "Checker activeren";
    icon.textContent = "▶";
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { action: "getState" }, (resp) => {
    if (chrome.runtime.lastError) return;
    if (resp) updateUI(resp.active);
  });
});

btn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) return;
    const action = isActive ? "deactivate" : "activate";
    chrome.tabs.sendMessage(tab.id, { action }, () => {
      if (chrome.runtime.lastError) return;
      updateUI(!isActive);
    });
  });
});
