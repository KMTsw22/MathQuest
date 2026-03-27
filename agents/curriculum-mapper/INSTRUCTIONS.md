# Curriculum Mapper — Instructions

## 학년별 핵심 주제 매핑표 (Common Core 기준)

| 학년 | 핵심 영역 | 대표 주제 |
|---|---|---|
| K | Counting & Cardinality, Operations | 수 세기, 10 이하 덧셈/뺄셈 |
| 1 | Operations & Algebraic Thinking, Number & Base Ten | 20 이하 덧셈/뺄셈, 자릿값 기초 |
| 2 | Number & Base Ten, Measurement | 100 이하 덧셈/뺄셈, 길이 측정 |
| 3 | Operations, Fractions, Geometry | 곱셈/나눗셈, 기본 분수, 넓이 |
| 4 | Multi-digit Arithmetic, Fractions | 큰 수 연산, 분수 덧셈/뺄셈, 소수 기초 |
| 5 | Fractions, Decimals, Volume | 분수 곱셈/나눗셈, 소수 연산, 부피 |
| 6 | Ratios, Expressions, Statistics | 비율, 정수, 방정식 기초, 통계 |
| 7 | Proportional Relationships, Geometry | 비례, 정수 연산, 기하 도형 |
| 8 | Linear Equations, Functions, Geometry | 일차방정식, 함수, 피타고라스 정리 |

---

## Step 1: 주제 → CCSS 표준 코드 매핑

CCSS 코드 형식: `{학년}.{영역}.{클러스터}.{표준번호}`
- 예: `3.NF.A.1` = 3학년(3) · Numbers & Fractions(NF) · 클러스터A · 표준1

### 주요 영역 약어
| 약어 | 영역명 |
|---|---|
| OA | Operations & Algebraic Thinking |
| NBT | Number & Operations in Base Ten |
| NF | Number & Operations — Fractions |
| MD | Measurement & Data |
| G | Geometry |
| RP | Ratios & Proportional Relationships (6–8) |
| EE | Expressions & Equations (6–8) |
| SP | Statistics & Probability (6–8) |
| F | Functions (8) |

---

## Step 2: 학년 적합성 판단

- 요청 주제가 해당 학년 범위 밖이면 `grade_appropriate: false` 반환
- 예: 3학년에서 분수 곱셈 요청 → false, notes에 "분수 곱셈은 5학년(5.NF.B)"으로 안내
- Orchestrator는 이 경우 사용자에게 경고 후 적합한 학년 주제로 대체

---

## Step 3: 세부 주제(Subtopic) 생성

- 해당 CCSS 표준 내에서 문제 다양성을 위해 2–5개 세부 주제 생성
- 세부 주제는 Problem Generator에 직접 전달되어 문제 생성의 다양성을 확보
- 예시 (3학년 분수):
  1. unit fractions (1/2, 1/3, 1/4)
  2. fractions on a number line
  3. equivalent fractions
  4. comparing fractions with same denominator
