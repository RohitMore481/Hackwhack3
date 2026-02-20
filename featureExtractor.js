function extractFeatures(url) {
    const urlObj = new URL(url);

    return {
        length: url.length,
        hasIP: /\d+\.\d+\.\d+\.\d+/.test(url),
        hasHTTPS: url.startsWith("https"),
        dotCount: (url.match(/\./g) || []).length,
        specialCharCount: (url.match(/[@\-_%]/g) || []).length,
        hasHyphen: urlObj.hostname.includes("-"),
        suspiciousKeywords: ["login","verify","secure","update","account","free","bank"]
            .filter(word => url.toLowerCase().includes(word))
    };
}