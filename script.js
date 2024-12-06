const GITHUB_REPO = "urs212/help_server"; // GitHub 리포지토리 경로
const FILE_PATH = "help.json"; // 업데이트할 JSON 파일 경로
const TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN"; // Personal Access Token

// 신고 제출 함수
async function submitReport() {
    const nickname = document.getElementById('nickname').value;
    const discord = document.getElementById('discord').value;
    const description = document.getElementById('description').value;
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : "없음";

    const report = {
        nickname,
        discord,
        description,
        file,
        timestamp: new Date().toISOString()
    };

    try {
        await updateGitHubJSON(report);
        alert("신고가 완료되었습니다! 디스코드로 결과가 전송됩니다.");
    } catch (error) {
        console.error("신고 저장 실패:", error);
        alert("신고를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
}

// GitHub JSON 업데이트 함수
async function updateGitHubJSON(newReport) {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
    const headers = {
        Authorization: `token ${TOKEN}`,
        "Content-Type": "application/json",
    };

    try {
        // 기존 파일 가져오기
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error("GitHub API 오류");

        const fileData = await response.json();
        const content = JSON.parse(atob(fileData.content));

        // 새로운 데이터 추가
        content.push(newReport);

        // 파일 업데이트
        const updatedContent = btoa(JSON.stringify(content, null, 2));
        const updateResponse = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                message: "Update help.json",
                content: updatedContent,
                sha: fileData.sha,
            }),
        });

        if (!updateResponse.ok) throw new Error("GitHub 업데이트 실패");
    } catch (error) {
        throw new Error("JSON 업데이트 실패: " + error.message);
    }
}
