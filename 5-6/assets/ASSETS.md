# DIGIMON 그림 에셋 — 5~6차시: 이미지 분류 AI와 반려동물 양육 책임

생성 도구: 내장 image_gen. 기존 hero-main PNG는 재생성·수정 없이 재사용했다. 신규 그림은 모든 생성 호출에 3-4/assets/_src/mascot.png를 캐릭터·화풍 참고 이미지로 제공했다. 음식 단독 아이콘에서는 같은 참고 그림의 화풍만 적용했다.

출력: 투명 RGBA WebP, quality=82, method=6. KB는 1024바이트 기준이다. 모든 파일은 150,000바이트 미만이다. 3:2의 640px 버전은 정수 픽셀 반올림으로 640×427px이다. 원본 비율을 유지해 알파 경계를 정리하고 투명 여백 안에 배치했으며, PNG 원본은 _src/에 보관했다. 배경 제거용 외부 모델은 사용하지 않았다.

검수: 최종 WebP를 하나씩 view_image로 확인했다. 글자·숫자·로고, 캐릭터 불일치, 배경 번짐을 확인했으며 요청한 체크·금지·경고·방향·물음표 기호만 사용했다. 위험 음식은 접시 또는 사진 카드에만 있으며 먹는 장면은 없다.

| 파일 | 픽셀 | KB | 설명 | 권장 alt |
|---|---:|---:|---|---|
| hero.webp | 960×540 | 82.32 | 밥그릇 앞에서 초록빛 AI 스캐너를 바라보는 마스코트 | 밥그릇의 먹이를 초록빛 스캐너로 확인하는 강아지 |
| act1-diet.webp | 640×427 | 49.56 | 공책에 식단을 조사하는 마스코트와 채소·고기 접시 | 채소와 익힌 고기 접시 옆에서 식단을 조사하는 강아지 |
| act2-train.webp | 640×427 | 68.50 | 음식 사진 카드를 초록 체크·빨강 X 바구니로 분류 | 음식 카드를 체크 표시와 금지 표시 바구니로 분류하는 강아지 |
| act3-program.webp | 640×427 | 49.77 | 블록 코딩 화면과 밥그릇 앞의 마스코트 | 색색의 코딩 블록이 보이는 화면과 밥그릇 앞에 앉은 강아지 |
| safe-food.webp | 240×240 | 12.75 | 사과 조각·당근·삶은 닭가슴살 접시 | 사과 조각, 당근, 삶은 닭가슴살이 담긴 접시 |
| danger-food.webp | 240×240 | 16.24 | 초콜릿·포도·양파 접시와 빨간 경고 삼각형 | 초콜릿, 포도, 양파 접시와 빨간 경고 삼각형 |

## 실제 생성 프롬프트

각 신규 그림에 쓴 전체 프롬프트는 아래 공통 프롬프트 뒤에 해당 파일의 Scene 구문을 이어 붙인 것이다. 참조 이미지: 3-4/assets/_src/mascot.png. transparent_background=true.

### 공통 프롬프트

```text
Use case: illustration-story. Create a single polished educational website illustration, on a genuinely transparent background with clean alpha edges, no background rectangle, no ground wash or haze. Reference image 1 is the ORIGINAL MASCOT and exact style reference: preserve this original baby puppy identity, cream fluffy fur, peach floppy ears, three-tuft forelock, rounded paws, curled fluffy tail, dark brown round eyes and tiny nose, peach cheeks. Match warm children's picture-book illustration, clean flat pastel colors, subtle watercolor paper texture INSIDE objects only, brown outlines, teal and coral accents. No copyrighted character resemblance. No text, no letters, no numbers, no logos, no watermark. Blank books/screens/charts have no labels, axes have no ticks or numerals. Simple child hands and paws. All objects fully inside canvas, modest transparent margin, readable at small size. Only symbols explicitly requested may appear.
```

### hero.webp

원본: _src/hero.png

```text
Scene: Wide 16:9. Puppy sits in front of a bowl of plain dog kibble and watches a friendly small teal AI scanner projecting a soft clearly bounded translucent GREEN scanning beam over the bowl. A green check symbol on small scanner display, otherwise no text. Beam stays inside objects' vignette.
```

### act1-diet.webp

원본: _src/act1-diet.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Cutout sticker illustration with no glow, no cast shadow.  Puppy holding chunky pencil over an open blank notebook studying diet, beside a plate of carrots, broccoli and plain fully cooked chicken breast. No writing or scribbles in notebook, only tiny simple food thumbnail shapes if needed. Puppy not eating.
```

### act2-train.webp

원본: _src/act2-train.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Cutout sticker illustration with no glow, no cast shadow.  Puppy watches food picture cards being sorted into two baskets: left pastel green basket has only a green check symbol and cards picturing carrot and cooked chicken; right pastel coral basket has only a red crossed-strokes prohibition symbol and picture cards of grapes and chocolate. A few cards above baskets with curved motion arrows. Unsafe food only pictured on cards, never being eaten. No letters, basket prohibition is a geometric cross not alphabet text.
Critical food safety correction: the green check basket's meat picture card MUST show three clearly BONELESS plain boiled CHICKEN BREAST SLICES, white curved triangular meat slices. No drumstick, no chicken leg, no bone anywhere on any card. Left food cards: one carrot, one plate of white boneless chicken breast slices. Keep right cards grapes and chocolate. Keep same puppy and green-check/red-cross sorting composition. Isolated objects with genuine transparency, no glow.
```

재생성 1회: 초록 바구니의 뼈 있는 닭다리 카드를 뼈 없는 닭가슴살 조각으로 교체。최초 미채택 PNG는 _src/의 -rejected- 파일로 보관했다.

최초 프롬프트의 Scene 구문:

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Cutout sticker illustration with no glow, no cast shadow.  Puppy watches food picture cards being sorted into two baskets: left pastel green basket has only a green check symbol and cards picturing carrot and cooked chicken; right pastel coral basket has only a red crossed-strokes prohibition symbol and picture cards of grapes and chocolate. A few cards above baskets with curved motion arrows. Unsafe food only pictured on cards, never being eaten. No letters, basket prohibition is a geometric cross not alphabet text.
```

### act3-program.webp

원본: _src/act3-program.png

```text
Scene: Landscape 4:3 source canvas, objects arranged in a compact horizontal group for later fitting to 3:2. Cutout sticker illustration with no glow, no cast shadow.  Puppy looks at a simple desktop monitor showing colorful interlocking block coding pieces, entirely blank blocks with no glyphs or labels. Beside it a small bowl of plain dog kibble. Teal monitor, coral yellow green blocks, friendly learning scene.
```

### safe-food.webp

원본: _src/safe-food.png

```text
Scene: Square 1:1. Food-only icon: a single cream ceramic plate neatly holding seedless peeled apple slices, carrot pieces, and plain boiled skinless chicken breast pieces. Three foods clearly recognizable. NO puppy or other animal in the output; reference used for picture-book style only. No utensils or symbols.
```

### danger-food.webp

원본: _src/danger-food.png

```text
Scene: Square 1:1. Food-only warning icon: a single cream ceramic plate holding a small unwrapped chocolate bar, a bunch of purple grapes, and one onion with a cut half. A bold red hollow warning triangle beside the plate, no exclamation glyph necessary. NO puppy or animal, no eating scene; reference used for picture-book style only. No text.
```
