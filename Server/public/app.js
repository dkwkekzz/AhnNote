// DOM 요소
const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');

// 노트 목록 가져오기
async function getNotes() {
    try {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('노트를 가져오는 중 오류 발생:', error);
    }
}

// 노트 표시하기
function displayNotes(notes) {
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <h3><i class="fas fa-heart"></i> ${note.title}</h3>
            <p>${note.content}</p>
            <div class="meta">
                <span><i class="fas fa-user"></i> ${note.author}</span>
                <span><i class="fas fa-clock"></i> ${new Date(note.createdAt).toLocaleString()}</span>
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editNote('${note._id}')">
                    <i class="fas fa-edit"></i> 수정하기
                </button>
                <button class="delete-btn" onclick="deleteNote('${note._id}')">
                    <i class="fas fa-trash"></i> 삭제하기
                </button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });
}

// 새 노트 생성
async function createNote(noteData) {
    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });
        if (response.ok) {
            noteForm.reset();
            getNotes();
            showMessage('노트가 성공적으로 저장되었습니다! 💕');
        } else {
            const error = await response.json();
            showMessage(error.message, 'error');
        }
    } catch (error) {
        console.error('노트 생성 중 오류 발생:', error);
        showMessage('노트 생성 중 오류가 발생했습니다.', 'error');
    }
}

// 노트 수정
async function editNote(id) {
    const title = prompt('새로운 제목을 입력하세요:');
    const content = prompt('새로운 내용을 입력하세요:');
    const author = prompt('새로운 작성자를 입력하세요:');

    if (title && content && author) {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, author })
            });
            if (response.ok) {
                getNotes();
                showMessage('노트가 성공적으로 수정되었습니다! ✨');
            } else {
                const error = await response.json();
                showMessage(error.message, 'error');
            }
        } catch (error) {
            console.error('노트 수정 중 오류 발생:', error);
            showMessage('노트 수정 중 오류가 발생했습니다.', 'error');
        }
    }
}

// 노트 삭제
async function deleteNote(id) {
    if (confirm('정말로 이 노트를 삭제하시겠습니까?')) {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                getNotes();
                showMessage('노트가 삭제되었습니다.');
            } else {
                const error = await response.json();
                showMessage(error.message, 'error');
            }
        } catch (error) {
            console.error('노트 삭제 중 오류 발생:', error);
            showMessage('노트 삭제 중 오류가 발생했습니다.', 'error');
        }
    }
}

// 메시지 표시 함수
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // 애니메이션 효과
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 10);

    // 3초 후 메시지 제거
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// 이벤트 리스너
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteData = {
        title: document.getElementById('title').value,
        content: document.getElementById('content').value,
        author: document.getElementById('author').value
    };
    createNote(noteData);
});

// 초기 노트 목록 로드
getNotes(); 