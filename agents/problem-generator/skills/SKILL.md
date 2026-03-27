# Skill: 문제 유형별 생성 템플릿

## 1. Word Problem (서술형)

### 템플릿 구조
```
[인물/상황 설정] [수학적 조건 제시] [질문]
```

### 예시 (3학년 분수, Medium)
```
Maria has a ribbon that is 3/4 of a foot long.
She cuts it into equal pieces, each 1/4 of a foot long.
How many pieces does she have?
Answer: 3
Solution:
  1. Each piece is 1/4 foot. The total is 3/4 foot.
  2. 3/4 ÷ 1/4 = 3 pieces.
```

### 맥락 소재 풀 (학년별 친숙한 소재 사용)
- 음식: pizza, pie, chocolate bar, sandwich, cake
- 학교: crayons, pencils, students, classroom, books
- 스포츠: basketball, running, soccer field, swimming
- 일상: money, shopping, trips, sharing

---

## 2. Equation (빈칸 채우기 / 식 계산)

### 템플릿 구조
```
수식에서 빈칸(___)을 채우거나 식의 결과를 계산.
```

### 예시
```
Easy:   1/2 + 1/2 = ___
Medium: 2/3 + ___ = 1
Hard:   3/4 - 1/8 = ___
```

### 규칙
- 빈칸은 항상 오른쪽에 배치 (Easy/Medium)
- Hard는 빈칸을 왼쪽 또는 중간에 배치 가능

---

## 3. Multiple Choice (4지선다)

### 템플릿 구조
```
문제 문장
A. [오답 — 일반적인 실수 반영]
B. [오답 — 단순 계산 오류 반영]
C. [정답]
D. [오답 — 무관한 값]
```

### 오답 생성 원칙
- A: 분자/분모를 뒤집는 실수 (예: 4/1 대신 1/4)
- B: 분모를 그대로 더하는 실수 (예: 1/4 + 1/4 = 2/8 대신 1/2)
- D: 완전히 다른 값 (혼동 방지용)

---

## 4. True / False

### 템플릿 구조
```
수학 명제 → True 또는 False
```

### 예시
```
Statement: "1/3 is greater than 1/2." → False
Statement: "2/4 is the same as 1/2." → True
```

### 규칙
- True와 False를 균등하게 출제
- 명제는 학생이 흔히 틀리는 오개념 기반으로 작성

---

## 5. Visual (시각적 문제)

### 텍스트 기반 시각 표현 방법

#### 수직선 (Number Line)
```
0          1/4         1/2         3/4          1
|-----------|-----------|-----------|-----------|
                         ^
         Where is the arrow pointing? Answer: 1/2
```

#### 분수 막대 (Fraction Bar)
```
|████████|        |
|← 3/4 →|← 1/4 →|
What fraction is shaded? Answer: 3/4
```

#### 파이 차트 (Pie Diagram)
```
 ___
/   \
| ⬛ |  ← 2 out of 4 parts shaded
\___/
What fraction is shaded? Answer: 2/4 = 1/2
```

### 규칙
- 텍스트 아트(ASCII)로 시각 요소 표현
- 시각 요소 다음에 명확한 질문 배치
- 정답은 단순하게 (분수 또는 정수)

---

## 난이도별 숫자 범위 (학년 공통 원칙)

| 난이도 | 숫자 범위 | 연산 복잡도 |
|---|---|---|
| Easy | 소수, 단순 분수(1/2, 1/4) | 1단계 연산 |
| Medium | 일반 분수, 두 자리 수 | 2단계 연산 |
| Hard | 혼합 분수, 세 자리 수 | 3단계 이상 또는 역산 포함 |

---

## 미국식 풀이법 HTML 템플릿

> 아래 각 템플릿은 `visual_html` 필드에 들어가는 자기 완결형 HTML이다.
> 실제 생성 시 숫자/레이블을 문제에 맞게 교체한다.

---

### 1. Area Model (면적 모델 / Box Method)
**용도**: 두 자리 이상 곱셈, 분수 곱셈, 다항식 전개

**예시: 25 × 14 계산**

```html
<div style="font-family:system-ui,sans-serif;max-width:520px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px">
  <p style="font-weight:700;margin:0 0 12px;color:#333">Area Model: 25 × 14</p>
  <div style="display:grid;grid-template-columns:60px 1fr 1fr;grid-template-rows:40px 1fr 1fr;gap:2px;text-align:center;font-size:14px">
    <!-- 헤더행 -->
    <div></div>
    <div style="background:#4A90D9;color:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700">20</div>
    <div style="background:#4A90D9;color:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700">5</div>
    <!-- 행 1 -->
    <div style="background:#4A90D9;color:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700">10</div>
    <div style="background:#E8F4FF;border:1px solid #4A90D9;border-radius:4px;display:flex;align-items:center;justify-content:center;height:60px;font-weight:600">200</div>
    <div style="background:#E8F4FF;border:1px solid #4A90D9;border-radius:4px;display:flex;align-items:center;justify-content:center;height:60px;font-weight:600">50</div>
    <!-- 행 2 -->
    <div style="background:#4A90D9;color:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700">4</div>
    <div style="background:#FFF3E0;border:1px solid #F5A623;border-radius:4px;display:flex;align-items:center;justify-content:center;height:60px;font-weight:600">80</div>
    <div style="background:#FFF3E0;border:1px solid #F5A623;border-radius:4px;display:flex;align-items:center;justify-content:center;height:60px;font-weight:600">20</div>
  </div>
  <p style="margin:12px 0 0;color:#555;font-size:14px">200 + 50 + 80 + 20 = <strong style="color:#4A90D9">350</strong></p>
</div>
```

**분수 곱셈 Area Model 예시: 2/3 × 3/4**

```html
<div style="font-family:system-ui,sans-serif;max-width:400px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px">
  <p style="font-weight:700;margin:0 0 12px;color:#333">Area Model: 2/3 × 3/4</p>
  <div style="position:relative;width:240px;height:160px;border:2px solid #333;margin:0 auto">
    <!-- 가로 분할선 (1/3, 2/3 위치) -->
    <div style="position:absolute;left:0;right:0;top:53px;border-top:1px dashed #999"></div>
    <div style="position:absolute;left:0;right:0;top:106px;border-top:2px solid #4A90D9"></div>
    <!-- 세로 분할선 (1/4, 2/4, 3/4 위치) -->
    <div style="position:absolute;top:0;bottom:0;left:60px;border-left:1px dashed #999"></div>
    <div style="position:absolute;top:0;bottom:0;left:120px;border-left:1px dashed #999"></div>
    <div style="position:absolute;top:0;bottom:0;left:180px;border-left:2px solid #4A90D9"></div>
    <!-- 음영 영역 (2/3 × 3/4 = 6/12 = 1/2) -->
    <div style="position:absolute;top:0;left:0;width:180px;height:106px;background:rgba(74,144,217,0.25)"></div>
    <!-- 레이블 -->
    <div style="position:absolute;top:-22px;left:0;width:180px;text-align:center;font-size:12px;color:#4A90D9;font-weight:700">← 3/4 →</div>
    <div style="position:absolute;top:0;left:-30px;height:106px;display:flex;align-items:center;font-size:12px;color:#4A90D9;font-weight:700">2/3</div>
  </div>
  <p style="text-align:center;margin:14px 0 0;font-size:14px;color:#555">Shaded = 6 out of 12 squares = <strong style="color:#4A90D9">1/2</strong></p>
</div>
```

---

### 2. Number Line (수직선 뛰어넘기)
**용도**: 덧셈/뺄셈, 분수 위치, 비교

**예시: 분수 위치 표시 (3/4)**

```html
<div style="font-family:system-ui,sans-serif;max-width:520px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px">
  <p style="font-weight:700;margin:0 0 16px;color:#333">Number Line: Where is 3/4?</p>
  <div style="position:relative;height:60px;margin:0 20px">
    <!-- 수직선 -->
    <div style="position:absolute;top:20px;left:0;right:0;height:3px;background:#333;border-radius:2px"></div>
    <!-- 0 눈금 -->
    <div style="position:absolute;top:10px;left:0;width:2px;height:22px;background:#333"></div>
    <div style="position:absolute;top:36px;left:-4px;font-size:12px;font-weight:700">0</div>
    <!-- 1/4 눈금 -->
    <div style="position:absolute;top:14px;left:25%;width:2px;height:14px;background:#999"></div>
    <div style="position:absolute;top:36px;left:calc(25% - 6px);font-size:11px;color:#666">1/4</div>
    <!-- 2/4 눈금 -->
    <div style="position:absolute;top:14px;left:50%;width:2px;height:14px;background:#999"></div>
    <div style="position:absolute;top:36px;left:calc(50% - 6px);font-size:11px;color:#666">1/2</div>
    <!-- 3/4 눈금 (정답 위치, 강조) -->
    <div style="position:absolute;top:8px;left:75%;width:3px;height:24px;background:#4A90D9"></div>
    <div style="position:absolute;top:-2px;left:calc(75% - 6px);font-size:13px;color:#4A90D9;font-weight:700">▼</div>
    <div style="position:absolute;top:36px;left:calc(75% - 6px);font-size:11px;color:#4A90D9;font-weight:700">3/4</div>
    <!-- 1 눈금 -->
    <div style="position:absolute;top:10px;right:0;width:2px;height:22px;background:#333"></div>
    <div style="position:absolute;top:36px;right:-4px;font-size:12px;font-weight:700">1</div>
  </div>
</div>
```

**예시: 덧셈 뛰어넘기 (28 + 35)**

```html
<div style="font-family:system-ui,sans-serif;max-width:520px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px">
  <p style="font-weight:700;margin:0 0 16px;color:#333">Number Line: 28 + 35</p>
  <div style="position:relative;height:80px;margin:0 16px">
    <div style="position:absolute;top:40px;left:0;right:0;height:3px;background:#333;border-radius:2px"></div>
    <!-- 28 -->
    <div style="position:absolute;top:30px;left:0;width:2px;height:22px;background:#333"></div>
    <div style="position:absolute;top:56px;left:-6px;font-size:12px;font-weight:700">28</div>
    <!-- +30 점프 → 58 -->
    <div style="position:absolute;top:30px;left:60%;width:2px;height:14px;background:#4A90D9"></div>
    <div style="position:absolute;top:56px;left:calc(60% - 6px);font-size:12px;color:#4A90D9;font-weight:700">58</div>
    <path d="" fill="none"/>
    <svg style="position:absolute;top:4px;left:0;width:100%;height:36px" viewBox="0 0 400 36">
      <path d="M 0 32 Q 120 0 240 32" fill="none" stroke="#4A90D9" stroke-width="2"/>
      <text x="120" y="14" text-anchor="middle" font-size="12" fill="#4A90D9" font-weight="bold">+30</text>
    </svg>
    <!-- +5 점프 → 63 -->
    <div style="position:absolute;top:30px;right:0;width:2px;height:22px;background:#333"></div>
    <div style="position:absolute;top:56px;right:-6px;font-size:12px;font-weight:700;color:#E67E22">63</div>
    <svg style="position:absolute;top:4px;left:60%;width:40%;height:36px" viewBox="0 0 160 36">
      <path d="M 0 32 Q 80 0 160 32" fill="none" stroke="#E67E22" stroke-width="2"/>
      <text x="80" y="14" text-anchor="middle" font-size="12" fill="#E67E22" font-weight="bold">+5</text>
    </svg>
  </div>
</div>
```

---

### 3. Tape Diagram (테이프 다이어그램)
**용도**: 서술형 문제 시각화, 비율, 분수

**예시: "Maria has 12 stickers. She gives 1/3 to her friend. How many does she keep?"**

```html
<div style="font-family:system-ui,sans-serif;max-width:480px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px">
  <p style="font-weight:700;margin:0 0 12px;color:#333">Draw (Tape Diagram)</p>
  <!-- 전체 테이프 -->
  <p style="font-size:12px;color:#666;margin:0 0 4px">Total: 12 stickers</p>
  <div style="display:flex;height:40px;border:2px solid #333;border-radius:4px;overflow:hidden;margin-bottom:8px">
    <div style="flex:1;background:#FF6B6B;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;border-right:2px solid #333">4 (given)</div>
    <div style="flex:2;background:#4A90D9;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px">8 (kept)</div>
  </div>
  <div style="display:flex;font-size:12px;color:#666">
    <div style="flex:1;text-align:center">1/3</div>
    <div style="flex:2;text-align:center">2/3</div>
  </div>
  <p style="margin:12px 0 0;font-size:13px;color:#555">
    Write: 12 ÷ 3 = 4 (one part) → Maria keeps 4 × 2 = <strong style="color:#4A90D9">8 stickers</strong>
  </p>
</div>
```

---

### 4. RDW (Read-Draw-Write) 전략
**용도**: 서술형 문제 전체 풀이 과정

```html
<div style="font-family:system-ui,sans-serif;max-width:520px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px">
  <!-- R: Read -->
  <div style="display:flex;align-items:flex-start;margin-bottom:12px">
    <div style="min-width:32px;height:32px;background:#4A90D9;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-right:10px">R</div>
    <div>
      <p style="font-weight:700;margin:0 0 4px;font-size:13px;color:#4A90D9">Read</p>
      <p style="margin:0;font-size:13px;color:#333">Maria has 3/4 of a pizza. She eats 1/4 more. How much pizza does she have now?</p>
    </div>
  </div>
  <!-- D: Draw -->
  <div style="display:flex;align-items:flex-start;margin-bottom:12px">
    <div style="min-width:32px;height:32px;background:#E67E22;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-right:10px">D</div>
    <div style="flex:1">
      <p style="font-weight:700;margin:0 0 6px;font-size:13px;color:#E67E22">Draw</p>
      <!-- 간단한 fraction bar -->
      <div style="display:flex;height:32px;border:2px solid #333;border-radius:4px;overflow:hidden;width:200px">
        <div style="flex:3;background:#4A90D9;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;border-right:2px solid #fff">3/4</div>
        <div style="flex:1;background:#E67E22;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700">+1/4</div>
      </div>
    </div>
  </div>
  <!-- W: Write -->
  <div style="display:flex;align-items:flex-start">
    <div style="min-width:32px;height:32px;background:#27AE60;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;margin-right:10px">W</div>
    <div>
      <p style="font-weight:700;margin:0 0 4px;font-size:13px;color:#27AE60">Write</p>
      <p style="margin:0;font-size:13px;color:#333">3/4 + 1/4 = 4/4 = <strong style="color:#27AE60">1 whole pizza</strong></p>
    </div>
  </div>
</div>
```

---

### 5. Fraction Bar (분수 막대)
**용도**: 분수 개념, 동치분수, 분수 비교

**예시: 동치분수 2/4 = 1/2**

```html
<div style="font-family:system-ui,sans-serif;max-width:400px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px">
  <p style="font-weight:700;margin:0 0 12px;color:#333">Are 1/2 and 2/4 the same?</p>
  <!-- 1/2 막대 -->
  <p style="font-size:12px;color:#666;margin:0 0 4px">1/2</p>
  <div style="display:flex;height:36px;border:2px solid #333;border-radius:4px;overflow:hidden;margin-bottom:8px;width:280px">
    <div style="flex:1;background:#4A90D9;border-right:2px solid #333"></div>
    <div style="flex:1;background:#E8F4FF"></div>
  </div>
  <!-- 2/4 막대 -->
  <p style="font-size:12px;color:#666;margin:0 0 4px">2/4</p>
  <div style="display:flex;height:36px;border:2px solid #333;border-radius:4px;overflow:hidden;margin-bottom:12px;width:280px">
    <div style="flex:1;background:#4A90D9;border-right:2px solid #333"></div>
    <div style="flex:1;background:#4A90D9;border-right:2px solid #333"></div>
    <div style="flex:1;background:#E8F4FF;border-right:2px solid #333"></div>
    <div style="flex:1;background:#E8F4FF"></div>
  </div>
  <p style="margin:0;font-size:13px;color:#555">The shaded parts are the same length → <strong style="color:#4A90D9">1/2 = 2/4 ✓</strong></p>
</div>
```

---

### 6. Place Value Chart (자릿값 표)
**용도**: 자릿값 이해, 큰 수 읽기, 소수

**예시: 3,456 자릿값**

```html
<div style="font-family:system-ui,sans-serif;max-width:420px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px">
  <p style="font-weight:700;margin:0 0 12px;color:#333">Place Value Chart: 3,456</p>
  <table style="border-collapse:collapse;width:100%;text-align:center;font-size:14px">
    <tr>
      <th style="border:2px solid #4A90D9;padding:8px 12px;background:#4A90D9;color:#fff">Thousands</th>
      <th style="border:2px solid #4A90D9;padding:8px 12px;background:#4A90D9;color:#fff">Hundreds</th>
      <th style="border:2px solid #4A90D9;padding:8px 12px;background:#4A90D9;color:#fff">Tens</th>
      <th style="border:2px solid #4A90D9;padding:8px 12px;background:#4A90D9;color:#fff">Ones</th>
    </tr>
    <tr>
      <td style="border:2px solid #4A90D9;padding:16px 12px;font-size:24px;font-weight:700;color:#E67E22">3</td>
      <td style="border:2px solid #4A90D9;padding:16px 12px;font-size:24px;font-weight:700;color:#27AE60">4</td>
      <td style="border:2px solid #4A90D9;padding:16px 12px;font-size:24px;font-weight:700;color:#9B59B6">5</td>
      <td style="border:2px solid #4A90D9;padding:16px 12px;font-size:24px;font-weight:700;color:#E74C3C">6</td>
    </tr>
  </table>
  <p style="margin:10px 0 0;font-size:12px;color:#666">3 thousands + 4 hundreds + 5 tens + 6 ones = 3,456</p>
</div>
```

---

### visual_html 생성 체크리스트

생성 전:
- [ ] 문제 유형과 학년에 맞는 풀이법 선택 (`INSTRUCTIONS.md` Step 4 표 참조)
- [ ] 문제의 실제 숫자/분수가 HTML에 반영되어 있는가?

생성 후:
- [ ] 외부 URL 참조 없음 (CDN, 이미지 URL 금지)
- [ ] 최대 너비 600px 이내 설계
- [ ] `<div>` 루트 태그 하나로 감싸져 있는가?
- [ ] 정답이 HTML에 노출되어 있지 않은가? (Flutter 학생 모드에서는 정답 숨김)
