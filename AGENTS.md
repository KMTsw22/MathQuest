# MathMultiAgent — System Map

미국 초중등 수학 문제 자동 생성 멀티 에이전트 시스템.
사용자 요청(학년 + 주제 + 문제 수)을 받아 검증된 워크시트를 출력한다.

---

## 에이전트 목록 & 역할

| 에이전트 | 디렉토리 | 핵심 역할 |
|---|---|---|
| Orchestrator | `agents/orchestrator/` | 요청 파싱, 하위 에이전트 배분, 결과 취합 |
| Curriculum Mapper | `agents/curriculum-mapper/` | Common Core 기준 학년별 주제 매핑 |
| Problem Generator | `agents/problem-generator/` | 학년 + 주제 + 난이도 기반 문제 초안 생성 |
| Difficulty Adjuster | `agents/difficulty-adjuster/` | Easy / Medium / Hard 비율 조정 및 변형 |
| Validator | `agents/validator/` | 정답 재계산, 학년 적합성 검사, 승인/반려 |
| Formatter | `agents/formatter/` | 학생용 / 교사용 워크시트 최종 출력 |

---

## 에이전트 간 흐름

```
사용자 요청 (예: "3학년, 분수, 10문제, Medium")
        │
        ▼
  orchestrator          ← 요청 파싱 & 각 에이전트에 작업 배분
        │
        ▼
curriculum-mapper       ← "3학년 = 기본 분수 개념(CCSS 3.NF)" 확인 후 주제 목록 반환
        │
        ▼
problem-generator       ← 주제별 문제 초안 N개 생성 (정답 포함)
        │
        ▼
difficulty-adjuster     ← Easy/Medium/Hard 비율(예: 3/5/2)로 문제 재조정
        │
        ▼
validator               ← 정답 재계산 & 학년 적합성 체크 → 반려 시 generator로 재요청
        │
        ▼
formatter               ← 학생용(문제만) / 교사용(문제+정답+풀이) 워크시트 출력
```

---

## 인터페이스 규약

에이전트 간 데이터는 JSON으로 전달한다.

### 입력 스키마 (Orchestrator → 각 에이전트)
```json
{
  "grade": 3,
  "topic": "fractions",
  "count": 10,
  "difficulty_mix": { "easy": 3, "medium": 5, "hard": 2 },
  "output_format": "worksheet"
}
```

### 문제 스키마 (에이전트 간 공통)
```json
{
  "id": "prob_001",
  "grade": 3,
  "topic": "fractions",
  "subtopic": "unit fractions",
  "difficulty": "medium",
  "type": "word_problem",
  "solving_method": "tape_diagram",
  "question": "...",
  "choices": ["1/8", "1/4", "3/8", "1/2", "3/4"],
  "correct_index": 1,
  "answer": "1/4",
  "solution_steps": ["...", "..."],
  "visual_html": "<div>...self-contained HTML...</div>",
  "ccss_standard": "3.NF.A.1",
  "validated": false,
  "adjustment_note": null
}
```

### solving_method 값 목록
| 값 | 미국식 풀이법 | 주로 쓰는 학년 |
|---|---|---|
| `area_model` | 면적 모델 (Box Method) | 3–6학년 곱셈/나눗셈/다항식 |
| `number_line` | 수직선 뛰어넘기 | K–5학년 덧뺄셈/분수 |
| `tape_diagram` | 테이프 다이어그램 (RDW Draw 단계) | 1–6학년 서술형 |
| `rdw` | Read-Draw-Write 전략 | 1–8학년 서술형 전체 |
| `place_value_chart` | 자릿값 표 | 1–5학년 자릿값/연산 |
| `fraction_bar` | 분수 막대 | 3–5학년 분수 |
| `standard` | 일반 세로식 또는 기본 계산 | 모든 학년 (보조) |

### output/problems.json 구조 (DB import용)
```json
{
  "meta": {
    "grade": 3,
    "topic": "fractions",
    "generated_at": "2026-03-25",
    "total": 10
  },
  "problems": [
    {
      "problem_id": "prob_001",
      "grade": 3,
      "topic": "fractions",
      "subtopic": "unit fractions",
      "difficulty": "medium",
      "type": "word_problem",
      "solving_method": "tape_diagram",
      "ccss_standard": "3.NF.A.1",
      "question_text": "...",
      "visual_html": "<div>...</div>",
      "choice_a": "1/8",
      "choice_b": "1/4",
      "choice_c": "3/8",
      "choice_d": "1/2",
      "choice_e": "3/4",
      "correct_index": 1,
      "correct_answer": "1/4",
      "solution_steps": ["Step 1: ...", "Step 2: ..."]
    }
  ]
}
```

---

## 최종 출력 파일 구조

이 프로젝트는 문제를 생성하여 **파일로 출력**한다.
DB 저장 및 Flutter 앱은 별도 프로젝트에서 이 파일을 읽어 처리한다.

```
에이전트 파이프라인 완료
        │
        ▼
formatter
  ├── output/problems.json     ← DB import용 (문제 + 보기 + 정답 + visual_html)
  ├── output/student.html      ← 학생용 워크시트 (정답 미포함)
  └── output/teacher.html      ← 교사용 답안지 (정답 + 풀이 포함)
```

출력 파일 상세: `db-schema/SCHEMA.md`

---

## 확장 가이드

- **새 학년 추가**: `curriculum-mapper/skills/SKILL.md`의 학년표에 행 추가
- **새 문제 유형 추가**: `problem-generator/skills/SKILL.md`에 템플릿 추가
- **새 출력 포맷 추가**: `formatter/skills/SKILL.md`에 레이아웃 추가
- **새 풀이법 추가**: `problem-generator/skills/SKILL.md`의 HTML 템플릿 섹션에 추가
- **새 에이전트 추가**: 이 파일 표에 행 추가 후 `agents/` 아래 디렉토리 생성
