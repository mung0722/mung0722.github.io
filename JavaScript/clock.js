function updateClock() {
    const now = new Date(); // 현재 날짜와 시간 가져오기
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1 필요)
    const date = String(now.getDate()).padStart(2, '0'); // 날짜
    const hours = String(now.getHours()).padStart(2, '0'); // 시간
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 분
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 초

    const formattedTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = formattedTime; // HTML 업데이트
  }

  setInterval(updateClock, 1000); // 1초마다 updateClock 함수 실행
  updateClock(); // 즉시 실행하여 로딩 후 바로 시간 표시