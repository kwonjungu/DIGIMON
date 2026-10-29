# DIGIMON 그림 에셋 — 7~8차시: 사이버 세상 속 동물 훈련시키기

생성 도구: 내장 image_gen. 기존 hero-main PNG는 재생성·수정 없이 재사용했다. 신규 그림은 모든 생성 호출에 3-4/assets/_src/mascot.png를 캐릭터·화풍 참고 이미지로 제공했다. 음식 단독 아이콘에서는 같은 참고 그림의 화풍만 적용했다.

출력: 투명 RGBA WebP, quality=82, method=6. KB는 1024바이트 기준이다. 모든 파일은 150,000바이트 미만이다. 3:2의 640px 버전은 정수 픽셀 반올림으로 640×427px이다. 원본 비율을 유지해 알파 경계를 정리하고 투명 여백 안에 배치했으며, PNG 원본은 _src/에 보관했다. 배경 제거용 외부 모델은 사용하지 않았다.

검수: 최종 WebP를 하나씩 view_image로 확인했다. 글자·숫자·로고, 캐릭터 불일치, 배경 번짐을 확인했으며 요청한 체크·금지·경고·방향·물음표 기호만 사용했다. 위험 음식은 접시 또는 사진 카드에만 있으며 먹는 장면은 없다.

| 파일 | 픽셀 | KB | 설명 | 권장 alt |
|---|---:|---:|---|---|
| hero.webp | 960×540 | 85.42 | 마이크에 말하는 아이와 화면 속 움직이는 마스코트 | 아이가 마이크에 말하면 화면 속 강아지가 소리 물결을 따라 움직이는 모습 |
| act1-voice.webp | 640×427 | 49.40 | 소리 물결 화살표를 따라 상하좌우로 움직이는 마스코트 | 소리 물결과 상하좌우 화살표에 맞춰 움직이는 강아지 |
| act2-refine.webp | 640×427 | 63.49 | 점프하고 회전하는 마스코트의 동작 잔상 | 점프와 회전 동작을 연습하는 강아지 |
| act3-noise.webp | 640×427 | 73.32 | 확성기·냄비·박수 소리에 헷갈리는 마스코트 | 확성기와 냄비, 박수 소리가 섞여 어리둥절한 강아지 |

## 실제 생성 프롬프트

각 신규 그림에 쓴 전체 프롬프트는 아래 공통 프롬프트 뒤에 해당 파일의 Scene 구문을 이어 붙인 것이다. 참조 이미지: 3-4/assets/_src/mascot.png. transparent_background=true.

### 공통 프롬프트

```text
Use case: illustration-story. Create a single polished educational website illustration, on a genuinely transparent background with clean alpha edges, no background rectangle, no ground wash or haze. Reference image 1 is the ORIGINAL MASCOT and exact style reference: preserve this original baby puppy identity, cream fluffy fur, peach floppy ears, three-tuft forelock, rounded paws, curled fluffy tail, dark brown round eyes and tiny nose, peach cheeks. Match warm children's picture-book illustration, clean flat pastel colors, subtle watercolor paper texture INSIDE objects only, brown outlines, teal and coral accents. No copyrighted character resemblance. No text, no letters, no numbers, no logos, no watermark. Blank books/screens/charts have no labels, axes have no ticks or numerals. Simple child hands and paws. All objects fully inside canvas, modest transparent margin, readable at small size. Only symbols explicitly requested may appear.
```

### hero.webp

원본: _src/hero.png

```text
Scene: Wide 16:9. One cheerful elementary-school child at left speaking into a small microphone; curved teal sound waves travel toward a large digital display on right where the reference puppy jumps happily. Child drawn simply, hands as simple rounded shapes. Puppy clearly INSIDE screen, monitor blank apart from puppy and tiny motion marks. No interface labels.
```

### act1-voice.webp

원본: _src/act1-voice.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Cutout sticker illustration with no glow, no cast shadow.  One puppy at center playfully responding to voice commands, surrounded by four clear curved sound-wave arrows pointing up down left right, arrows in teal coral yellow mint. Small faint puppy pose silhouettes near arrow ends imply movement, keep one primary puppy. No words.
```

### act2-refine.webp

원본: _src/act2-refine.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Cutout sticker illustration with no glow, no cast shadow.  One vivid puppy happily mid-jump with a curled circular teal motion arrow showing a spin; two pale translucent afterimage poses trail behind and below to communicate jumping then turning. Same puppy identity in all poses, simple rounded paws. No numbers.
```

### act3-noise.webp

원본: _src/act3-noise.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Cutout sticker illustration with no glow, no cast shadow.  Puppy center with gently puzzled expression and tilted head, surrounded by a coral megaphone, a cooking pot with lid rattling, and two very simply drawn clapping hands. Overlapping short sound wave arcs convey noise. A teal question-mark punctuation symbol floats above the puppy head to convey confusion; this is the one explicitly requested punctuation symbol, no letters or numbers. Friendly not frightened.
```
