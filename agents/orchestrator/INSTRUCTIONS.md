# Orchestrator — Instructions

## Step 1: 요청 파싱

사용자 입력에서 아래 필드를 추출한다. 누락된 필드는 기본값을 사용한다.

| 필드 | 설명 | 기본값 |
|---|---|---|
| `grade` | 학년 (K, 1–8) | 없으면 사용자에게 재질문 |
| `topic` | 수학 주제 (fractions, algebra 등) | 없으면 curriculum-mapper가 추천 |
| `count` | 문제 수 | 10 |
| `difficulty_mix` | Easy/Medium/Hard 비율 | `{easy:3, medium:5, hard:2}` |
| `output_format` | worksheet / json / pdf | worksheet |

### 유효성 검사
- 학년이 K, 1–8 범위 밖이면 오류 메시지 반환 후 중단.
- 문제 수가 1 미만 또는 50 초과면 오류 메시지 반환 후 중단.
- `difficulty_mix` 합계가 `count`와 다르면 비율로 재계산.

---

## Step 2: 라우팅 (에이전트 순차 호출)

```
[1] curriculum-mapper 호출
    입력: { grade, topic }
    출력: { ccss_standards[], subtopics[] }

[2] problem-generator 호출
    입력: { grade, subtopics[], count, difficulty_mix }
    출력: problems[]  (초안, validated=false)

[3] difficulty-adjuster 호출
    입력: { problems[], difficulty_mix }
    출력: problems[]  (비율 조정 완료)

[4] validator 호출
    입력: { problems[], grade }
    출력: { approved: problems[], rejected: problems[] }

    → rejected가 있으면 [2]로 돌아가 rejected 수만큼 재생성 (최대 3회 재시도)
    → 3회 후에도 rejected 남으면 해당 문제 제외하고 경고 메시지 포함

[5] formatter 호출
    입력: { problems: approved[], output_format, grade }
    출력: { student_sheet, teacher_sheet }
```

---

## Step 3: 결과 취합 & 반환

```json
{
  "status": "success",
  "grade": 3,
  "topic": "fractions",
  "total_problems": 10,
  "approved_count": 10,
  "rejected_count": 0,
  "warnings": [],
  "student_sheet": "...",
  "teacher_sheet": "..."
}
```

실패 시:
```json
{
  "status": "error",
  "message": "오류 설명",
  "grade": 3
}
```
