console.log("🔍 AI 걸름이 작동 중");



const API_KEY = "WEMCUHW0I6K0JO0BQUMSFNHK5WHVABK3"; // 🔑 여기에 본인 Sapling API 키 입력

const checkAIWithSapling = async (text) => {
  try {
    const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    return data.fake_probability; // 0.0 ~ 1.0
  } catch (e) {
    console.error("API 요청 실패:", e);
    return 0.0;
  }
};

const results = document.querySelectorAll('div.g');

let aiDetected = false;

const aiPatterns = [
   /as an (ai|artificial intelligence) language model/,
  /\b(chatgpt|gpt[- ]?4|gpt[- ]?3.5|claude|bard)\b/i,
  /\b(this (essay|article|response) (discusses|will discuss))\b/i,
  /generated (by|with)/i
];

results.forEach(async (result) => {
  const snippet = result.innerText.toLowerCase();

  const patternMatch = aiPatterns.some(pattern => pattern.test(snippet));
  const prob = await checkAIWithSapling(snippet); // 확률 분석
  const isAI = patternMatch || prob > 0.7; // 하나라도 해당되면 AI 의심

  if (isAI) {
    aiDetected = true;
    result.style.opacity = "0.3";

    const tag = document.createElement("div");
    tag.textContent = `🤖 [AI 의심 글] (${(prob * 100).toFixed(0)}%)`;
    tag.style.color = "red";
    tag.style.fontWeight = "bold";
    tag.style.marginBottom = "5px";
    result.prepend(tag);
  }
});

// 모든 분석이 끝난 후 메시지 표시 (딜레이 감안)
setTimeout(() => {
  if (!aiDetected) {
    const notice = document.createElement("div");
    notice.textContent = "✅ 이번 검색에는 AI 의심 글이 없습니다!";
    notice.style.padding = "10px";
    notice.style.backgroundColor = "#e8f5e9";
    notice.style.color = "#2e7d32";

    const searchResults= document.getElementById("search");
    if (searchResults){
      searchResults.prepend(notice);
    }
  }
},5000);
