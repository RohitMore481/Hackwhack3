function calculateRisk(features) {
    let score = 0;
    let reasons = [];

    if (features.hasIP) {
        score += 25;
        reasons.push("+25 → IP address detected");
    }

    if (!features.hasHTTPS) {
        score += 15;
        reasons.push("+15 → Not using HTTPS");
    }

    if (features.length > 75) {
        score += 10;
        reasons.push("+10 → Long URL");
    }

    if (features.dotCount > 3) {
        score += 10;
        reasons.push("+10 → Too many subdomains");
    }

    if (features.hasHyphen) {
        score += 10;
        reasons.push("+10 → Hyphen in domain");
    }

    if (features.suspiciousKeywords.length > 0) {
        let keywordScore = features.suspiciousKeywords.length * 10;
        score += keywordScore;
        reasons.push(`+${keywordScore} → Suspicious keywords: ${features.suspiciousKeywords.join(", ")}`);
    }

    return {
        score: Math.min(score, 100),
        reasons
    };
}