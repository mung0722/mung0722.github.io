let windowCount = 0; // 창의 고유 ID를 위한 카운터
const openWindows = new Map(); // URL별로 열린 창을 추적

function openWindow(url) {
  // 이미 해당 URL에 대한 창이 열려 있는지 확인
  if (openWindows.has(url)) {
    const existingWindowId = openWindows.get(url);
    const existingWindow = document.getElementById(existingWindowId);

    if (existingWindow) {
      // 창을 맨 앞으로 가져오기
      existingWindow.style.zIndex = ++windowCount;
      return;
    } else {
      // 예외 상황: 창이 닫힌 경우 맵에서 제거
      openWindows.delete(url);
    }
  }

  // 새로운 창 생성
  windowCount++; 
  const windowId = `custom-window-${windowCount}`;

  const newWindow = document.createElement('div');
  newWindow.id = windowId;
  newWindow.className = 'custom-window';
  newWindow.style.zIndex = windowCount; 
  newWindow.innerHTML = `
    <div class="custom-window-header">
      <div class="window-controls">
        <span class="close" onclick="closeWindow('${windowId}', '${url}')">&#10005;</span>
        <span class="minimize" onclick="minimizeWindow('${windowId}')">&#9473;</span>
        <span class="maximize" onclick="toggleMaximize('${windowId}')">&#9723;</span>
      </div>
      <div class="title"> ${url}</div>
    </div>
    <div class="custom-window-content">
      <iframe src="${url}" width="100%" height="100%" style="border:none;"></iframe>
    </div>
    <div class="resize-handle"></div>
  `;

  document.body.appendChild(newWindow);
  centerWindow(newWindow);

  // 해당 URL과 창 ID를 맵에 저장
  openWindows.set(url, windowId);

  // 드래그 및 크기 조정 기능 추가
  addDragFunctionality(newWindow);
  addResizeFunctionality(newWindow);
}

function centerWindow(element) { //중앙으로 배치
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const elementWidth = element.offsetWidth;
  const elementHeight = element.offsetHeight;

  const left = (windowWidth - elementWidth) / 2;
  const top = (windowHeight - elementHeight) / 2;

  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
}

function closeWindow(windowId, url) {
  const windowElement = document.getElementById(windowId);
  if (windowElement) {
    windowElement.remove();
  }
  // 창이 닫힐 때 URL-창 매핑에서 제거
  openWindows.delete(url);
}

function minimizeWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  if (windowElement) {
    windowElement.style.height = '40px';
    windowElement.querySelector('.custom-window-content').style.display = 'none';
  }
}

function toggleMaximize(windowId) {
  const windowElement = document.getElementById(windowId);
  if (windowElement) {
    const isMaximized = windowElement.classList.toggle('maximized');
    if (isMaximized) {
      windowElement.style.width = '100%';
      windowElement.style.height = '100%';
      windowElement.style.top = '0';
      windowElement.style.left = '0';
    } else {
      windowElement.style.width = '400px';
      windowElement.style.height = '300px';
      windowElement.style.top = '100px';
      windowElement.style.left = '100px';
    }
  }
}


// 드래그 기능
function addDragFunctionality(windowElement) {
  const header = windowElement.querySelector('.custom-window-header');
  let offsetX = 0, offsetY = 0;

  header.addEventListener('mousedown', (e) => {
    offsetX = e.clientX - windowElement.offsetLeft;
    offsetY = e.clientY - windowElement.offsetTop;

    function moveWindow(e) {
      windowElement.style.left = `${e.clientX - offsetX}px`;
      windowElement.style.top = `${e.clientY - offsetY}px`;
    }

    document.addEventListener('mousemove', moveWindow);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', moveWindow);
    }, { once: true });
  });
}

// 창 크기 조정 기능
function addResizeFunctionality(windowElement) {
  const resizeHandle = windowElement.querySelector('.resize-handle');

  resizeHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowElement.offsetWidth;
    const startHeight = windowElement.offsetHeight;

    function resizeWindow(e) {
      windowElement.style.width = `${startWidth + (e.clientX - startX)}px`;
      windowElement.style.height = `${startHeight + (e.clientY - startY)}px`;
    }

    document.addEventListener('mousemove', resizeWindow);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', resizeWindow);
    }, { once: true });
  });
}