# Validator — Instructions

## Step 1: 정답 재계산

각 문제에 대해 `question`과 `solution_steps`를 읽지 않고, **문제 문장만 보고** 직접 정답을 계산한다.
계산 결과와 `answer` 필드를 비교한다.

### 재계산 규칙
- 분수: 최소공배수(LCD)로 통분 후 계산, 결과를 기약분수로 표현
- 소수: 자릿수 맞춰 계산
- 방정식: 이항 및 양변 정리
- 선택형: 보기 A–D 중 정답 식별 후 `answer` 필드와 대조

### 판정
- 일치 → 정답 검증 통과
- 불일치 → `rejection_type: "wrong_answer"` 로 반려

---

## Step 2: 학년 적합성 체크

아래 항목을 순서대로 확인한다.

### 2-1. CCSS 범위 확인
- `ccss_standard` 필드의 코드가 해당 학년에 속하는지 확인
- 예: `5.NF.B.4` 코드가 grade=3 문제에 있으면 반려

### 2-2. 개념 수준 확인
- 해당 학년에서 아직 배우지 않은 개념이 문제에 포함되어 있는지 확인
- 예: 3학년 문제에서 분수 곱셈 요구 → 반려
- 예: 6학년 문제에서 미적분 개념 암시 → 반려

### 2-3. 언어 수준 확인
- 단어 수준이 해당 학년 독해력에 맞는지 확인
  - K–2: 단순 문장, 짧은 단어
  - 3–5: 복합 문장 허용, 수학 용어 제한적
  - 6–8: 수학 전문 용어 사용 가능
- 너무 복잡한 문장 → `rejection_type: "language_level"` 반려

### 2-4. 문제 모호성 확인
- 정답이 두 가지 이상 가능한 문제 → `rejection_type: "ambiguous"` 반려
- 예: "What is the fraction?" (맥락 불충분)

---

## Step 3: 반려 or 승인

### 승인 조건 (모두 만족해야 함)
- [x] 정답이 재계산 결과와 일치
- [x] CCSS 코드가 학년에 적합
- [x] 개념 수준이 학년에 적합
- [x] 언어 수준이 학년에 적합
- [x] 정답이 유일함 (모호성 없음)

### 반려 유형 코드
| 코드 | 설명 |
|---|---|
| `wrong_answer` | 정답 오류 |
| `grade_mismatch` | 학년 범위 초과 개념 |
| `language_level` | 언어 수준 부적절 |
| `ambiguous` | 정답 모호 |
| `duplicate` | 세션 내 중복 문제 |

### 반려 시 출력 예시
```json
{
  "id": "prob_007",
  "validated": false,
  "rejection_reason": "3학년 문제에 분수 나눗셈(5학년 개념) 포함됨",
  "rejection_type": "grade_mismatch"
}
```

---

## 반려율 기준

- 반려율 30% 이하: 정상 → Orchestrator에 결과 반환
- 반려율 30% 초과: 경고 메시지 포함 → Orchestrator가 Problem Generator에 재요청 판단
