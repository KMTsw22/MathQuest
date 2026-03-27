# Problem Generator — Instructions

## Step 1: 난이도별 문제 수 계산

`difficulty_mix`에서 Easy/Medium/Hard 수를 확인한다.
합계가 `count`와 다를 경우 비율에 맞게 반올림하여 조정한다.

예: count=10, mix={easy:3, medium:5, hard:2}
- Easy 3문제, Medium 5문제, Hard 2문제 생성

---

## Step 2: 문제 유형 선택

각 subtopic마다 아래 유형을 순환하며 사용 (단조로움 방지):

| 유형 | 코드명 | 설명 |
|---|---|---|
| 서술형 문제 | `word_problem` | 실생활 맥락이 있는 문장 문제 |
| 식 계산 | `equation` | 빈칸 채우기 형식의 수식 문제 |
| 선택형 | `multiple_choice` | **5지선다 (A–E)** |
| 참/거짓 | `true_false` | 명제의 참/거짓 판단 |
| 시각적 | `visual` | 미국식 시각화 도구 (Area Model 등) |

### 유형 배분 권장 비율 (10문제 기준)
- word_problem: 4개
- equation: 2개
- multiple_choice: 2개
- true_false: 1개
- visual: 1개

> **중요**: 모든 문제 유형에 `visual_html` 필드가 포함되어야 한다.
> `type`이 `visual`인 문제는 시각 요소가 문제의 핵심이고,
> 나머지 유형은 풀이 과정을 시각화한 `visual_html`을 보조로 제공한다.

---

## Step 3: 문제 생성 규칙

### 공통 규칙
1. 문제 언어는 **영어**로 작성 (미국 교육과정 기준)
2. 학생 이름은 다양하게 사용 (Alex, Maria, James, Priya, Liam 등)
3. 실생활 맥락 사용 (음식, 스포츠, 학교, 쇼핑 등)
4. 같은 숫자 조합이나 같은 문장 구조 반복 금지
5. 각 문제에 `ccss_standard` 태그 반드시 포함

### 정답 작성 규칙
- 분수: `3/4` 형식 (분자/분모)
- 소수: `0.75` 형식
- 정수: 숫자만 (`12`)
- 모든 문제는 **5지선다** `choices[]` 배열 필수 (A–E)
  - `correct_index`: 0–4 (A=0, B=1, C=2, D=3, E=4)
  - `answer`: correct_index에 해당하는 값과 동일
- 풀이 단계(`solution_steps`)는 최소 2단계, 최대 5단계

### 5지선다 오답 생성 원칙
오답 4개는 학생이 실제로 범하는 오류를 반영:
1. 분자/분모 뒤집기 (역수 실수)
2. 분모를 그대로 더하는 실수 (예: 1/4+1/4=2/8)
3. 연산 방향 실수 (덧셈 대신 뺄셈)
4. 완전히 다른 수 (혼동 방지용 허수아비)
정답 위치는 A–E 사이에서 무작위로 배치.

### 오류 방지 규칙
- 나눗셈 문제에서 나머지가 있는 경우 명시
- 분수는 기약분수로 표현 (단, 문제 의도상 약분 전 표현이 필요한 경우 제외)
- 음수가 나오는 문제는 해당 학년에서 음수를 다루는지 확인 후 생성

---

## Step 4: 미국식 풀이법 선택 & visual_html 생성

모든 문제에 `solving_method`와 `visual_html`을 생성한다.

### 학년 + 주제별 풀이법 우선순위

| 주제 | 우선 풀이법 | 대체 풀이법 |
|---|---|---|
| 덧셈/뺄셈 (K–2) | `number_line` | `tape_diagram` |
| 곱셈/나눗셈 (3–5) | `area_model` | `number_line` |
| 분수 개념 (3–4) | `fraction_bar` | `number_line` |
| 분수 연산 (4–5) | `area_model` | `fraction_bar` |
| 서술형 전체 | `rdw` (tape_diagram 포함) | — |
| 자릿값 (1–4) | `place_value_chart` | — |
| 비율/방정식 (6–8) | `tape_diagram` | `standard` |

### visual_html 생성 규칙
1. **자기 완결형 HTML** 생성: `<div>...</div>` 블록, 외부 CSS/JS 의존 없음
2. 인라인 스타일(`style=""`)만 사용
3. 색상: 파란색(#4A90D9) 주조색, 흰 배경
4. 폰트: system-ui, sans-serif (웹폰트 금지)
5. 최대 너비 600px 기준 설계 (모바일 대응)
6. 각 풀이법별 HTML 템플릿은 `skills/SKILL.md` 참고

### RDW 전략 적용 (서술형 문제 필수)
word_problem 유형은 `solution_steps`를 RDW 구조로 작성:
```
R (Read):   "Maria has 3/4 of a pizza..."
D (Draw):   visual_html에 테이프 다이어그램 또는 그림 포함
W (Write):  "3/4 - 1/4 = 2/4 = 1/2. Maria has 1/2 of the pizza left."
```

---

## Step 5: 중복 방지

생성 중 아래 항목 추적:
- 사용된 숫자 조합 목록
- 사용된 실생활 맥락 목록
- 사용된 문제 유형 순서

같은 세션 내에서 동일한 조합이 반복되면 다른 숫자/맥락으로 대체.
