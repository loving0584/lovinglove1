// DOM 요소들이 모두 로드된 후에 스크립트를 실행합니다.
document.addEventListener('DOMContentLoaded', () => {

    // HTML에서 필요한 요소들을 가져옵니다.
    const logForm = document.getElementById('log-form');
    const subjectInput = document.getElementById('subject-input');
    const contentInput = document.getElementById('content-input');
    const timeInput = document.getElementById('time-input');
    const logList = document.getElementById('log-list');

    // 브라우저의 로컬 스토리지에서 저장된 학습 기록을 불러옵니다.
    let logs = JSON.parse(localStorage.getItem('studyLogs')) || [];

    // 학습 기록을 화면에 그려주는 함수
    const renderLogs = () => {
        logList.innerHTML = '';

        logs.forEach((log, index) => {
            const li = document.createElement('li');
            li.className = 'log-item';
            const timeDisplay = log.time ? `<span class="time">${log.time}분</span>` : '';

            // '수정'과 '삭제' 버튼을 actions div로 감싸줍니다.
            li.innerHTML = `
                <div class="content">
                    <div class="subject">${log.subject}</div>
                    <p class="details">${log.content}</p>
                    <div class="meta">
                        <span class="date">${log.date}</span>
                        ${timeDisplay}
                    </div>
                </div>
                <div class="actions">
                    <button class="edit-btn" data-index="${index}">수정</button>
                    <button class="delete-btn" data-index="${index}">삭제</button>
                </div>
            `;
            logList.appendChild(li);
        });
    };

    // 로컬 스토리지에 학습 기록을 저장하는 함수
    const saveLogs = () => {
        localStorage.setItem('studyLogs', JSON.stringify(logs));
    };

    // '기록하기' 버튼을 누르면(폼이 제출되면) 실행될 함수
    logForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const subject = subjectInput.value.trim();
        const content = contentInput.value.trim();
        const time = timeInput.value.trim();

        if (subject && content) {
            const newLog = {
                subject: subject,
                content: content,
                time: time,
                date: new Date().toLocaleDateString('ko-KR')
            };

            logs.unshift(newLog);
            saveLogs();
            renderLogs();
            logForm.reset();
        }
    });

    // 목록 영역(수정, 삭제 버튼 포함)에서 클릭 이벤트가 발생했을 때 실행될 함수
    logList.addEventListener('click', (event) => {
        const target = event.target;
        const index = target.dataset.index;

        if (index === undefined) return; // 버튼이 아닌 곳을 클릭하면 무시

        // '수정' 버튼이 클릭된 경우
        if (target.classList.contains('edit-btn')) {
            // 수정할 데이터를 가져옵니다.
            const logToEdit = logs[index];

            // 상단 입력창에 데이터를 채워넣습니다.
            subjectInput.value = logToEdit.subject;
            contentInput.value = logToEdit.content;
            timeInput.value = logToEdit.time;

            // 기존 데이터를 배열에서 삭제합니다.
            logs.splice(index, 1);

            // 변경된 데이터를 저장하고 화면을 다시 그려줍니다.
            saveLogs();
            renderLogs();
            
            // 사용자가 바로 수정할 수 있도록 페이지 상단으로 스크롤하고 입력창에 포커스를 줍니다.
            window.scrollTo(0, 0);
            subjectInput.focus();
        }
        
        // '삭제' 버튼이 클릭된 경우
        if (target.classList.contains('delete-btn')) {
            logs.splice(index, 1);
            saveLogs();
            renderLogs();
        }
    });

    // 페이지가 처음 로드될 때 저장된 기록들을 화면에 표시합니다.
    renderLogs();
});
