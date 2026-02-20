importScripts("featureExtractor.js", "riskEngine.js");

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.action === "analyze") {
        const features = extractFeatures(request.url);
        const result = calculateRisk(features);

        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: showModal,
            args: [request.url, result]
        });
    }
});

function showModal(url, result) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "20%";
    modal.style.left = "50%";
    modal.style.transform = "translateX(-50%)";
    modal.style.padding = "20px";
    modal.style.background = "#111";
    modal.style.color = "#fff";
    modal.style.zIndex = "9999";
    modal.style.borderRadius = "10px";

    modal.innerHTML = `
        <h2>Link Safety Analysis</h2>
        <p><strong>URL:</strong> ${url}</p>
        <p><strong>Threat Score:</strong> ${result.score}/100</p>
        <p><strong>Reasons:</strong></p>
        <ul>${result.reasons.map(r => `<li>${r}</li>`).join("")}</ul>
        <button id="proceed">Proceed</button>
        <button id="cancel">Cancel</button>
    `;

    document.body.appendChild(modal);

    document.getElementById("proceed").onclick = () => {
        window.location.href = url;
    };

    document.getElementById("cancel").onclick = () => {
        modal.remove();
    };
}