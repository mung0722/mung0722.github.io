let windowCount = 0; // 창의 고유 ID를 위한 카운터
const openWindows = new Map(); // URL별로 열린 창을 추적

function openWindow(url, windowwidth, windowheight) {
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
  newWindow.style.width = `${windowwidth}px`;
  newWindow.style.height = `${windowheight}px`;
  newWindow.innerHTML = `
    <div class="custom-window-header">
      <div class="window-controls">
        <span class="close" onclick="closeWindow('${windowId}', '${url}')"><img id="close_hover" src="./img/button/close.png"></span>
        <span class="minimize" onclick="minimizeWindow('${windowId}')"><img id="min_hover" src="./img/button/min.png"></span>
        <span class="maximize" onclick="toggleMaximize('${windowId}')"><img id="max_hover" src="./img/button/max.png"></span>
      </div>
      <div class="title"> ${url}</div>
    </div>
    <div class="custom-window-content">
       <iframe src="${url}" width="${windowwidth}" height="${windowheight}" style="border:none;"></iframe>
    </div>
    <div class="resize-handle"></div>
  `;
  // iframe에서 유튜브를 재생할 때 사이즈가 마음에 안들면 상단 <iframe>에서 width와 height를 절대값으로 바꿀것
  // 기본값
  // <iframe src="${url}" width="100%" height="100%" style="border:none;"></iframe>

  
  document.body.appendChild(newWindow);
  centerWindow(newWindow);

  // 해당 URL과 창 ID를 맵에 저장
  openWindows.set(url, windowId);

  // 드래그 및 크기 조정 기능 추가
  addDragFunctionality(newWindow);
  addResizeFunctionality(newWindow);

const close_hover = document.getElementById('close_hover');
const min_hover = document.getElementById('min_hover');
const max_hover = document.getElementById('max_hover');

// close_hover
close_hover.addEventListener('mouseover', () => {
  close_hover.src = './img/button/close_hover.png';
});
close_hover.addEventListener('mouseout', () =>{
  close_hover.src = './img/button/close.png';
});
// min_hover
min_hover.addEventListener('mouseover', () => {
  min_hover.src = './img/button/min_hover.png';
});
min_hover.addEventListener('mouseout', () =>{
  min_hover.src = './img/button/min.png';
});
// max_hover
max_hover.addEventListener('mouseover', () => {
  max_hover.src = './img/button/max_hover.png';
});
max_hover.addEventListener('mouseout', () =>{
  max_hover.src = './img/button/max.png';
});

// const custom_window = document.querySelector('.custom-window');
// custom_window.style.width = `${windowwidth}px`;
// custom_window.style.height = `${windowheight}px`;

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