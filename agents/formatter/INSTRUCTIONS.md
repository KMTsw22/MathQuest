# Formatter — Instructions

이 에이전트는 항상 **3개의 파일**을 동시에 출력한다.

| 파일 | 용도 | 포함 내용 |
|---|---|---|
| `output/problems.json` | DB import용 | 문제 + 보기 + 정답 + visual_html 전체 |
| `output/student.html` | 학생용 워크시트 | 문제 + 보기만 (정답 없음) |
| `output/teacher.html` | 교사용 답안지 | 문제 + 정답 + 풀이 + visual_html |

---

## Step 1: 문제 정렬

기본 정렬: Easy → Medium → Hard 순서.
같은 난이도 내에서는 입력 순서 유지.
문제 번호는 1부터 시작.

---

## Step 2: output/problems.json 생성 (DB import용)

이 파일이 이 프로젝트의 핵심 출력물이다.
나중에 외부 DB에 직접 import하거나 다른 앱이 읽는다.

```json
{
  "meta": {
    "grade": 3,
    "topic": "fractions",
    "generated_at": "YYYY-MM-DD",
    "total": 10,
    "difficulty_distribution": { "easy": 3, "medium": 5, "hard": 2 },
    "ccss_standards": ["3.NF.A.1", "3.NF.A.2"]
  },
  "problems": [
    {
      "problem_id": "prob_001",
      "number": 1,
      "grade": 3,
      "topic": "fractions",
      "subtopic": "unit fractions",
      "difficulty": "easy",
      "type": "word_problem",
      "solving_method": "tape_diagram",
      "ccss_standard": "3.NF.A.1",
      "question_text": "Maria has a pizza cut into 4 equal slices...",
      "visual_html": "<div style=\"...\">...</div>",
      "choice_a": "1/8",
      "choice_b": "1/4",
      "choice_c": "3/8",
      "choice_d": "1/2",
      "choice_e": "3/4",
      "correct_index": 1,
      "correct_answer": "1/4",
      "solution_steps": [
        "Step 1: The pizza is divided into 4 equal parts.",
        "Step 2: Maria ate 1 part, so the fraction is 1/4."
      ],
      "adjustment_note": null
    }
  ]
}
```

### 주의사항
- `visual_html` 값은 JSON 문자열로 이스케이프 처리 (`"` → `\"`, 줄바꿈 → `\n`)
- `problem_id`는 `prob_` + 3자리 숫자 (예: `prob_001`)
- `correct_index`는 0-based (A=0, B=1, C=2, D=3, E=4)
- `solution_steps`는 학생용 파일에 노출되지 않음 (이 JSON에만 포함)

---

## Step 3: output/student.html 생성 (학생용)

완전한 HTML 파일로 출력. 브라우저에서 열면 바로 인쇄 가능.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grade [N] Math Worksheet — [Topic]</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 40px auto; padding: 20px; color: #333; }
    h1 { text-align: center; font-size: 20px; border-bottom: 2px solid #4A90D9; padding-bottom: 8px; }
    .meta { display: flex; justify-content: space-between; margin: 16px 0 24px; font-size: 14px; }
    .meta-field { border-bottom: 1px solid #333; min-width: 180px; padding-bottom: 2px; }
    .section-header { background: #4A90D9; color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: 700; margin: 24px 0 16px; }
    .problem { margin-bottom: 28px; page-break-inside: avoid; }
    .problem-number { font-weight: 700; font-size: 15px; margin-bottom: 6px; }
    .problem-text { font-size: 14px; line-height: 1.6; margin-bottom: 10px; }
    .visual { margin: 10px 0; }
    .choices { margin: 10px 0 6px; }
    .choice { font-size: 14px; margin: 4px 0 4px 16px; }
    .answer-line { margin-top: 8px; font-size: 14px; color: #666; }
    .footer { text-align: center; margin-top: 48px; color: #888; font-size: 13px; border-top: 1px solid #ddd; padding-top: 16px; }
    @media print { .section-header { -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <h1>Grade [N] Math Worksheet — [Topic]</h1>
  <div class="meta">
    <span>Name: <span class="meta-field">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    <span>Date: <span class="meta-field">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    <span>Score: ___ / [N]</span>
  </div>

  <div class="section-header">⭐ Easy (Problems 1–[E])</div>

  <div class="problem">
    <div class="problem-number">1.</div>
    <div class="problem-text">[question_text]</div>
    <div class="visual">[visual_html — 학생이 보는 시각 자료]</div>
    <div class="choices">
      <div class="choice">A. [choice_a]</div>
      <div class="choice">B. [choice_b]</div>
      <div class="choice">C. [choice_c]</div>
      <div class="choice">D. [choice_d]</div>
      <div class="choice">E. [choice_e]</div>
    </div>
    <div class="answer-line">My answer: ____</div>
  </div>

  <!-- 나머지 문제 반복 -->

  <div class="footer">Keep up the great work! Show your work and explain your thinking.</div>
</body>
</html>
```

### 학생용 제외 항목
- `correct_index`, `correct_answer` 포함 금지
- `solution_steps` 포함 금지
- `ccss_standard` 포함 금지 (교사용만)
- `visual_html`에서 정답이 노출되는 부분이 있다면 `___` 처리

---

## Step 4: output/teacher.html 생성 (교사용 답안지)

학생용과 같은 구조에 아래 요소를 추가:

```html
<!-- 각 문제 아래에 추가 -->
<div class="answer-key">
  <p><strong>✓ Answer:</strong> [correct_answer] (Choice [A/B/C/D/E])</p>
  <p><strong>Standard:</strong> [ccss_standard] | <strong>Method:</strong> [solving_method] | <strong>Difficulty:</strong> [difficulty]</p>
  <div class="solution">
    <p><strong>Solution:</strong></p>
    <ol>
      <li>[solution_steps[0]]</li>
      <li>[solution_steps[1]]</li>
    </ol>
  </div>
</div>
```

교사용 스타일 추가:
```css
.answer-key { background: #f0f8ff; border-left: 4px solid #4A90D9; padding: 10px 14px; margin-top: 8px; border-radius: 0 4px 4px 0; font-size: 13px; }
.solution ol { margin: 4px 0 0 16px; padding: 0; }
.solution li { margin: 3px 0; color: #555; }
```

---

## 공통 포맷 규칙

1. 선택형 보기는 항상 A–E 5개 출력
2. `visual_html`은 학생용과 교사용 모두에 포함 (문제 이해용)
3. 헤더에 학년, 주제, 날짜, 총 문제 수 항상 표시
4. 난이도 구간마다 섹션 헤더 삽입 (Easy / Medium / Hard)
5. `problems.json`의 `visual_html`은 이스케이프된 문자열, HTML 파일에서는 원본 태그 사용
