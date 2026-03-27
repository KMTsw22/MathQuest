# Skill: 워크시트 레이아웃 템플릿

## 1. Worksheet 레이아웃 원칙

### 가독성 기준
- 문제 번호는 굵게 표시 (텍스트: `1.`, PDF: bold)
- 문제 사이 빈 줄 2개 (학생용) / 1개 (교사용)
- 난이도 구간마다 구분선(`---`) 삽입
- 답란은 고정 길이 밑줄: `_______________` (15자)

### 페이지 구성 권장 (PDF 기준)
- A4 또는 Letter 사이즈 기준
- 상단 여백: 헤더 (학교명 라인 선택, 이름/날짜 필드)
- 본문: 문제 목록
- 하단: 격려 문구 또는 교사 서명란 (교사용)

---

## 2. 문제 유형별 표시 형식

### Word Problem
```
1. Maria has a pizza cut into 4 equal slices. She eats 1 slice.
   What fraction of the pizza did she eat?

   Answer: _______________
```

### Equation
```
2. Fill in the blank:

   1/2 + 1/4 = _______________
```

### Multiple Choice
```
3. Which fraction is equivalent to 2/4?

   A. 1/3
   B. 1/2
   C. 3/4
   D. 2/3

   Answer: ___
```

### True / False
```
4. True or False:  1/3 > 1/2

   Answer: _______________
```

### Visual (Number Line)
```
5. Look at the number line below. What fraction does the arrow point to?

   0          1/4         1/2         3/4          1
   |-----------|-----------|-----------|-----------|
                                ^

   Answer: _______________
```

---

## 3. 교사용 Answer Key 추가 요소

각 문제 아래에 아래 블록 추가:
```
   [TEACHER] Difficulty: Medium | Type: word_problem | Standard: 3.NF.A.1
   ✓ Answer: 1/4
   Solution:
     Step 1: The pizza has 4 equal parts → denominator is 4.
     Step 2: Maria ate 1 part → numerator is 1.
     Step 3: Fraction = 1/4.
```

---

## 4. 헤더 템플릿

### 학생용 헤더
```
============================================================
Name: ___________________________   Date: __________________
Class: __________________________   Score: ___ / 10

          Grade [X] Math Worksheet — [Topic]
                   Total: [N] Problems
============================================================
```

### 교사용 헤더
```
============================================================
          ANSWER KEY — Grade [X] [Topic] Worksheet
          Generated: [DATE] | Total: [N] Problems
          Distribution: Easy [E] / Medium [M] / Hard [H]
============================================================
```

---

## 5. 푸터 템플릿

### 학생용 푸터
```
============================================================
              Keep up the great work! You've got this!
============================================================
```

### 교사용 푸터
```
============================================================
Teacher Notes:
_____________________________________________________________
_____________________________________________________________

Signature: _______________________   Date: _________________
============================================================
```

---

## 6. JSON 스키마 (API 연동용)

출력 JSON은 아래 구조를 따른다:
```json
{
  "$schema": "math-worksheet-v1",
  "metadata": {
    "grade": "integer (K=0, 1-8)",
    "topic": "string",
    "subtopics": ["string"],
    "ccss_standards": ["string"],
    "difficulty_distribution": {
      "easy": "integer",
      "medium": "integer",
      "hard": "integer"
    },
    "total_problems": "integer",
    "generated_date": "YYYY-MM-DD"
  },
  "student_problems": [
    {
      "number": "integer",
      "difficulty": "easy|medium|hard",
      "type": "word_problem|equation|multiple_choice|true_false|visual",
      "question": "string",
      "choices": "object|null (선택형만)"
    }
  ],
  "teacher_key": [
    {
      "number": "integer",
      "answer": "string",
      "ccss_standard": "string",
      "solution_steps": ["string"],
      "adjustment_note": "string|null"
    }
  ]
}
```
