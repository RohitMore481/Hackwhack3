chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: scanPage
    }, (results) => {
        document.getElementById("report").innerHTML = results[0].result;
    });
});

function scanPage() {

    let report = "";
    let riskCount = 0;

    // Cookies
    const cookieCount = document.cookie.split(";").filter(c => c.trim() !== "").length;
    if (cookieCount > 20) {
        report += `<p class="risk">⚠ Excessive cookies detected (${cookieCount})</p>`;
        riskCount++;
    } else {
        report += `<p class="safe">✔ Cookie count normal (${cookieCount})</p>`;
    }

    // Local Storage
    const localStorageSize = Object.keys(localStorage).length;
    if (localStorageSize > 20) {
        report += `<p class="risk">⚠ Heavy localStorage usage (${localStorageSize})</p>`;
        riskCount++;
    } else {
        report += `<p class="safe">✔ localStorage usage normal</p>`;
    }

    // Scripts
    const scripts = document.querySelectorAll("script[src]");
    let externalDomains = new Set();
    scripts.forEach(script => {
        try {
            const srcUrl = new URL(script.src);
            if (srcUrl.hostname !== location.hostname) {
                externalDomains.add(srcUrl.hostname);
            }
        } catch {}
    });

    if (externalDomains.size > 5) {
        report += `<p class="risk">⚠ Multiple third-party scripts (${externalDomains.size})</p>`;
        riskCount++;
    } else {
        report += `<p class="safe">✔ Script sources normal</p>`;
    }

    // Iframes
    const iframeCount = document.querySelectorAll("iframe").length;
    if (iframeCount > 5) {
        report += `<p class="risk">⚠ High number of iframes (${iframeCount})</p>`;
        riskCount++;
    } else {
        report += `<p class="safe">✔ Iframe count normal</p>`;
    }

    // Sensitive Forms
    const sensitiveInputs = document.querySelectorAll("input[type='password'], input[name*='card']");
    if (sensitiveInputs.length > 0 && location.protocol !== "https:") {
        report += `<p class="risk">⚠ Sensitive form over non-secure HTTP</p>`;
        riskCount++;
    } else {
        report += `<p class="safe">✔ No insecure sensitive forms detected</p>`;
    }

    report += `<hr><strong>Total Risk Indicators: ${riskCount}</strong>`;

    return report;
}