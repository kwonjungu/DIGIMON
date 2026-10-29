# DIGIMON 그림 에셋 — 메인

생성 도구: 내장 image_gen. 기존 hero-main PNG는 재생성·수정 없이 재사용했다. 신규 그림은 모든 생성 호출에 3-4/assets/_src/mascot.png를 캐릭터·화풍 참고 이미지로 제공했다. 음식 단독 아이콘에서는 같은 참고 그림의 화풍만 적용했다.

출력: 투명 RGBA WebP, quality=82, method=6. KB는 1024바이트 기준이다. 모든 파일은 150,000바이트 미만이다. 3:2의 640px 버전은 정수 픽셀 반올림으로 640×427px이다. 원본 비율을 유지해 알파 경계를 정리하고 투명 여백 안에 배치했으며, PNG 원본은 _src/에 보관했다. 배경 제거용 외부 모델은 사용하지 않았다.

검수: 최종 WebP를 하나씩 view_image로 확인했다. 글자·숫자·로고, 캐릭터 불일치, 배경 번짐을 확인했으며 요청한 체크·금지·경고·방향·물음표 기호만 사용했다. 위험 음식은 접시 또는 사진 카드에만 있으며 먹는 장면은 없다.

| 파일 | 픽셀 | KB | 설명 | 권장 alt |
|---|---:|---:|---|---|
| hero-main.webp | 960×540 | 119.91 | 마스코트와 데이터 그래프, 말풍선, 음식 접시, 마이크, 확성기가 원형으로 떠 있는 표지 | 데이터 그래프와 말풍선, 음식 접시, 마이크, 확성기에 둘러싸인 강아지 |
| lesson-1-2.webp | 480×360 | 37.47 | 마스코트가 막대그래프와 지구본을 보며 조사 | 막대그래프와 지구본을 살펴보는 크림색 강아지 |
| lesson-3-4.webp | 480×360 | 41.03 | 마스코트와 연필, 말풍선, 그림 액자 | 연필과 빈 말풍선, 그림 액자 곁에 앉은 강아지 |
| lesson-5-6.webp | 480×360 | 40.15 | 안전한 먹이 접시와 X 표시 접시, 작은 스캐너 | 안전한 먹이와 금지 표시 접시를 스캐너로 살피는 강아지 |
| lesson-7-8.webp | 480×360 | 38.50 | 마이크 소리 물결을 따라 점프하는 마스코트 | 마이크에서 나오는 소리 물결을 따라 뛰는 강아지 |
| lesson-9.webp | 480×360 | 33.62 | 확성기와 하트 깃발로 캠페인하는 마스코트 | 확성기와 하트 깃발을 든 강아지 |

## 실제 생성 프롬프트

각 신규 그림에 쓴 전체 프롬프트는 아래 공통 프롬프트 뒤에 해당 파일의 Scene 구문을 이어 붙인 것이다. 참조 이미지: 3-4/assets/_src/mascot.png. transparent_background=true.

### 공통 프롬프트

```text
Use case: illustration-story. Create a single polished educational website illustration, on a genuinely transparent background with clean alpha edges, no background rectangle, no ground wash or haze. Reference image 1 is the ORIGINAL MASCOT and exact style reference: preserve this original baby puppy identity, cream fluffy fur, peach floppy ears, three-tuft forelock, rounded paws, curled fluffy tail, dark brown round eyes and tiny nose, peach cheeks. Match warm children's picture-book illustration, clean flat pastel colors, subtle watercolor paper texture INSIDE objects only, brown outlines, teal and coral accents. No copyrighted character resemblance. No text, no letters, no numbers, no logos, no watermark. Blank books/screens/charts have no labels, axes have no ticks or numerals. Simple child hands and paws. All objects fully inside canvas, modest transparent margin, readable at small size. Only symbols explicitly requested may appear.
```

### hero-main.webp

원본: _src/hero-main.png

기존 PNG 재사용. 이번 작업에서는 이미지 생성 도구를 호출하지 않았으므로 실제 생성 프롬프트는 알 수 없다. 아래는 기존 그림에 대응하는 사용자 제공 제작 지시이며, 실제 사용 프롬프트라고 주장하지 않는다.

> 마스코트가 가운데, 둘레에 데이터 그래프, 말풍선, 음식 접시, 마이크, 확성기가 둥글게 떠 있는 표지 그림. 16:9, 960px.

### lesson-1-2.webp

원본: _src/lesson-1-2.png

```text
Scene: Landscape 4:3. The puppy studies a small pastel bar chart and a tabletop globe with curiosity. Three clear unlabelled colored bars, simple continents. A compact balanced vignette.
```

### lesson-3-4.webp

원본: _src/lesson-3-4.png

```text
Scene: Landscape 4:3. Puppy holds a chunky pencil; a completely empty speech bubble floats nearby; a small picture frame contains a simple flower drawing. Compact balanced vignette.
```

### lesson-5-6.webp

원본: _src/lesson-5-6.png

```text
Scene: Landscape 4:3. Puppy sits behind two plates and a tiny teal AI scanner. Left plate has plain cooked chicken and carrot with small green check symbol. Right plate has a red cross symbol on an upright circular marker and onion resting on plate. Puppy is NOT eating or touching unsafe food. No alphabet letter X: use only crossed diagonal strokes as prohibition symbol.
```

### lesson-7-8.webp

원본: _src/lesson-7-8.png

```text
Scene: Landscape 4:3. Puppy joyfully jumps following three curved teal sound waves from a small microphone, dynamic rounded paws and curled tail, compact balanced vignette.
```

### lesson-9.webp

원본: _src/lesson-9.png

```text
Scene: Landscape 4:3. Puppy conducting a caring pet campaign, holding a small coral megaphone and a teal pennant flag with one coral heart symbol, happy inviting pose.
```
