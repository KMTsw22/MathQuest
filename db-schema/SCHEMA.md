# DB Schema & 파일 출력 가이드

이 프로젝트는 문제를 생성하여 파일로 출력한다.
DB 저장은 이 파일을 읽어 외부에서 처리한다.

---

## 출력 파일 목록

```
output/
├── problems.json     ← DB import용 핵심 파일
├── student.html      ← 학생용 워크시트 (인쇄 가능)
└── teacher.html      ← 교사용 답안지 (인쇄 가능)
```

---

## problems.json 전체 스키마

```json
{
  "meta": {
    "grade": "integer (0=K, 1–8)",
    "topic": "string",
    "generated_at": "YYYY-MM-DD",
    "total": "integer",
    "difficulty_distribution": {
      "easy": "integer",
      "medium": "integer",
      "hard": "integer"
    },
    "ccss_standards": ["string"]
  },
  "problems": [
    {
      "problem_id": "string (예: prob_001)",
      "number": "integer (1-based)",
      "grade": "integer",
      "topic": "string",
      "subtopic": "string",
      "difficulty": "easy | medium | hard",
      "type": "word_problem | equation | multiple_choice | true_false | visual",
      "solving_method": "area_model | number_line | tape_diagram | rdw | fraction_bar | place_value_chart | standard",
      "ccss_standard": "string (예: 3.NF.A.1)",
      "question_text": "string",
      "visual_html": "string (이스케이프된 HTML)",
      "choice_a": "string",
      "choice_b": "string",
      "choice_c": "string",
      "choice_d": "string",
      "choice_e": "string",
      "correct_index": "integer (0=A, 1=B, 2=C, 3=D, 4=E)",
      "correct_answer": "string (correct_index에 해당하는 choice 값)",
      "solution_steps": ["string"],
      "adjustment_note": "string | null"
    }
  ]
}
```

---

## 추천 DB 테이블 구조 (외부 프로젝트 참고용)

### problems 테이블
```sql
CREATE TABLE problems (
  id            SERIAL PRIMARY KEY,
  problem_id    VARCHAR(20) UNIQUE NOT NULL,   -- 'prob_001'
  grade         SMALLINT NOT NULL,             -- 0(K)~8
  topic         VARCHAR(100) NOT NULL,
  subtopic      VARCHAR(100),
  difficulty    VARCHAR(10) NOT NULL,          -- 'easy'|'medium'|'hard'
  type          VARCHAR(30) NOT NULL,
  solving_method VARCHAR(30) NOT NULL,
  ccss_standard VARCHAR(20),
  question_text TEXT NOT NULL,
  visual_html   TEXT NOT NULL,                 -- 자기완결형 HTML 스니펫
  choice_a      VARCHAR(200) NOT NULL,
  choice_b      VARCHAR(200) NOT NULL,
  choice_c      VARCHAR(200) NOT NULL,
  choice_d      VARCHAR(200) NOT NULL,
  choice_e      VARCHAR(200) NOT NULL,
  correct_index SMALLINT NOT NULL,             -- 0~4
  correct_answer VARCHAR(200) NOT NULL,
  solution_steps JSONB,                        -- ["Step 1: ...", "Step 2: ..."]
  adjustment_note TEXT,
  created_at    DATE NOT NULL
);
```

### 인덱스 권장
```sql
CREATE INDEX idx_problems_grade       ON problems(grade);
CREATE INDEX idx_problems_topic       ON problems(topic);
CREATE INDEX idx_problems_difficulty  ON problems(difficulty);
CREATE INDEX idx_problems_ccss        ON problems(ccss_standard);
```

---

## visual_html 저장 방식

### JSON 파일 내 (이스케이프 문자열)
```json
"visual_html": "<div style=\"font-family:system-ui;padding:16px\">\n  <p style=\"color:#4A90D9\">...</p>\n</div>"
```

### DB 저장 시 (TEXT 컬럼, 이스케이프 불필요)
```sql
INSERT INTO problems (visual_html, ...) VALUES ('<div style="...">...</div>', ...);
```

### HTML 파일 내 (원본 태그 그대로)
```html
<div class="visual">
  <div style="font-family:system-ui;padding:16px">
    <p style="color:#4A90D9">...</p>
  </div>
</div>
```

---

## problems.json import 예시 (Python)

나중에 DB에 넣을 때 참고용 예시 코드:

```python
import json
import psycopg2
from datetime import date

with open("output/problems.json", "r", encoding="utf-8") as f:
    data = json.load(f)

conn = psycopg2.connect("dbname=mathdb user=postgres")
cur = conn.cursor()

for p in data["problems"]:
    cur.execute("""
        INSERT INTO problems (
            problem_id, grade, topic, subtopic, difficulty, type,
            solving_method, ccss_standard, question_text, visual_html,
            choice_a, choice_b, choice_c, choice_d, choice_e,
            correct_index, correct_answer, solution_steps,
            adjustment_note, created_at
        ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (problem_id) DO NOTHING
    """, (
        p["problem_id"], p["grade"], p["topic"], p["subtopic"],
        p["difficulty"], p["type"], p["solving_method"], p["ccss_standard"],
        p["question_text"], p["visual_html"],
        p["choice_a"], p["choice_b"], p["choice_c"], p["choice_d"], p["choice_e"],
        p["correct_index"], p["correct_answer"],
        json.dumps(p["solution_steps"]),
        p.get("adjustment_note"),
        data["meta"]["generated_at"]
    ))

conn.commit()
cur.close()
conn.close()
```

---

## 파일명 규칙

배치 생성 시 날짜와 학년/주제를 파일명에 포함:
```
output/
├── 2026-03-25_grade3_fractions_problems.json
├── 2026-03-25_grade3_fractions_student.html
└── 2026-03-25_grade3_fractions_teacher.html
```

Orchestrator가 출력 시 `{date}_{grade}_{topic}_` 접두사를 파일명에 붙인다.
