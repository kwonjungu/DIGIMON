# DIGIMON 3~4차시 그림 에셋

초등학교 5학년 「나만의 반려동물 만들기」 수업용 그림 10종.

## 제작·내보내기

- 제작 도구: 내장 `image_gen.imagegen` 생성형 이미지 도구. SVG나 코드로 그림을 그리지 않았다.
- `mascot.png`를 먼저 생성하고 확정한 뒤, 나머지 9개 생성 요청에 `_src/mascot.png`를 캐릭터·화풍 참조 이미지로 첨부했다. 도장·빈 액자는 화풍만 참조한다.
- 원본: `_src/`의 PNG 10개. 생성 결과를 그대로 복사하여 보관했다.
- 페이지용: 이 폴더의 투명 배경 RGBA WebP 10개. Pillow LANCZOS 축소, WebP 품질 82, method 6. 생성된 알파를 보존했으며 별도 배경 제거는 필요하지 않았다.
- 종횡비를 유지하여 지정 캔버스 가운데에 배치했다. 3:2 그림은 긴 변 640px에 맞춰 높이를 정수 반올림한 427px로 내보냈다. 패딩은 투명하다.
- 용량은 1KB = 1,000바이트 기준이며, PNG 원본에는 150KB 제한을 적용하지 않는다.
- 모든 WebP를 `view_image`로 각각 직접 열어 글자·숫자·로고 부재, 캐릭터 일관성, 배경 투명도, 구성과 기호 가독성을 확인했다. 활동 1의 물음표는 요청된 유일한 기호 예외다. 빈 액자의 물음표 모양은 발자국으로 구성했다.
- 10개 모두 크기·150KB 이하·알파 최솟값 0/최댓값 255를 확인했다. 각 파일은 1회 생성으로 확정했으며 재생성은 없었다.
- 이 작업에서 저장소에 쓴 파일은 `3-4/assets/` 안의 에셋과 이 문서뿐이다. HTML 수정 및 git commit·push는 수행하지 않았다.

## 페이지용 파일

| 파일 | 크기(px) | 용량(KB) | 한 줄 설명 | 권장 alt 문구 |
| --- | --- | ---: | --- | --- |
| [mascot.webp](mascot.webp) | 480 × 480 | 34.04 | 크림색 강아지·고양이 혼합 원작 마스코트의 앞발 인사 | 앞발을 흔들며 인사하는 크림색 아기 반려동물 |
| [act1-factcheck.webp](act1-factcheck.webp) | 640 × 427 | 58.98 | 청록 돋보기로 AI 로봇의 물음표 말풍선을 살피는 장면 | 돋보기로 AI 로봇의 대답을 확인하는 반려동물 |
| [act2-prompt.webp](act2-prompt.webp) | 640 × 427 | 45.75 | 코랄 연필과 말풍선에서 그림 액자로 이어지는 프롬프트 장면 | 연필을 든 반려동물 옆에서 말풍선이 그림 액자로 바뀌는 모습 |
| [act3-handdraw.webp](act3-handdraw.webp) | 640 × 427 | 58.94 | 아이의 검지를 따라 무지개 붓 선을 그리는 장면과 주황 웹캠 | 아이의 손끝을 따라 무지개 선을 그리는 반려동물과 작은 웹캠 |
| [wrap-summary.webp](wrap-summary.webp) | 640 × 427 | 47.56 | 공책 위에서 엄지 척 하는 마스코트와 파란 별 | 공책 위에서 엄지를 들어 보이는 반려동물과 반짝이는 별 |
| [stamp-1.webp](stamp-1.webp) | 240 × 240 | 27.74 | 청록색 돋보기 기호가 있는 둥근 잉크 도장 자국 | 돋보기가 새겨진 청록색 활동 완료 도장 |
| [stamp-2.webp](stamp-2.webp) | 240 × 240 | 30.84 | 코랄색 말풍선·연필 기호가 있는 둥근 잉크 도장 자국 | 말풍선과 연필이 새겨진 코랄색 활동 완료 도장 |
| [stamp-3.webp](stamp-3.webp) | 240 × 240 | 29.75 | 주황색 붓·발바닥 기호가 있는 둥근 잉크 도장 자국 | 붓과 발바닥이 새겨진 주황색 활동 완료 도장 |
| [empty-canvas.webp](empty-canvas.webp) | 320 × 320 | 13.67 | 발자국을 물음표 모양으로 배치한 연한 회색 빈 액자 | 발자국이 물음표 모양으로 놓인 아직 비어 있는 그림 액자 |
| [pair-ab.webp](pair-ab.webp) | 320 × 160 | 19.28 | 서로 마주 앉아 한 아이는 말하고 다른 아이는 그리는 짝 활동 | 마주 앉아 한 명은 설명하고 다른 한 명은 그림을 그리는 두 아이 |

WebP 합계: 366.54KB. 최대 단일 파일: 58.98KB.

## 생성 원본

| PNG 원본 | 크기(px) | 용량(KB) |
| --- | --- | ---: |
| [_src/mascot.png](_src/mascot.png) | 1254 × 1254 | 1591.36 |
| [_src/act1-factcheck.png](_src/act1-factcheck.png) | 1536 × 1024 | 2162.09 |
| [_src/act2-prompt.png](_src/act2-prompt.png) | 1536 × 1024 | 1926.31 |
| [_src/act3-handdraw.png](_src/act3-handdraw.png) | 1536 × 1024 | 2077.83 |
| [_src/wrap-summary.png](_src/wrap-summary.png) | 1536 × 1024 | 1963.37 |
| [_src/stamp-1.png](_src/stamp-1.png) | 1254 × 1254 | 1046.61 |
| [_src/stamp-2.png](_src/stamp-2.png) | 1254 × 1254 | 1307.66 |
| [_src/stamp-3.png](_src/stamp-3.png) | 1254 × 1254 | 1355.67 |
| [_src/empty-canvas.png](_src/empty-canvas.png) | 1254 × 1254 | 1636.42 |
| [_src/pair-ab.png](_src/pair-ab.png) | 1774 × 887 | 1688.50 |

## 실제 사용한 프롬프트

모든 요청에 `transparent_background: true`를 사용했다. 마스코트 최초 생성에는 참조 이미지가 없으며, 이후 요청은 `_src/mascot.png` 한 장만 참조했다. 아래는 요청별 전체 프롬프트다.

### mascot.webp

```text
Use case: illustration-story. Create ONE original classroom website mascot asset, a square 1:1 composition. A round chubby baby pet blending a puppy and kitten, cream fur, softly triangular floppy ears with peach inner ears, a little three-tuft forelock, two dark brown dot eyes, tiny dark brown oval nose and friendly smiling mouth, pale peach cheeks, plump short body, rounded paws and one small curled fluffy tail. Front-facing, one front paw raised waving with three tiny peach toe pads and a larger peach pad. No clothing or accessories. Warm storybook illustration, clean flat pastel shapes with subtle watercolor grain, rounded shapes, consistent medium-weight warm brown outlines. Tiny teal #0B8F78 color accent only if needed, mostly cream and warm pastels. Full character visible with comfortable clear margin, centered readable silhouette. Truly transparent background with alpha, isolated cutout, no background rectangle, no checkerboard drawn into the artwork, no ground plane, no shadow. Original character, no resemblance to Digimon, Pokemon, Sanrio or any existing franchise. no text, no letters, no numbers, no logos, no watermark.
```

### act1-factcheck.webp

```text
Use case: illustration-story. ONE isolated classroom website illustration, wide 3:2 aspect ratio. Input image 1 is the established mascot AND style reference, not an image to reproduce unchanged. Preserve exactly its cream fur, floppy peach-inside ears, three-tuft forelock, rounded brown eyes, tiny brown nose, peach cheeks, round paws, curled fluffy tail and plump baby proportions. Same warm storybook style: clean flat pastel shapes, delicate watercolor grain and consistent warm brown outlines. All scene objects fully visible, compact balanced composition with generous clear edge margin. Truly transparent background with alpha, no background fill, no vignette, no floor, no checkerboard artwork. Original unbranded characters; no existing franchise resemblance. no text, no letters, no numbers, no logos, no watermark. Scene: the mascot holds a large magnifying glass with a teal #0B8F78 rim, examining a speech bubble coming from a small cute original AI robot beside it. Robot is rounded ivory with teal accents, two friendly dot eyes, simple short antenna and small limbs, no screen labels. Speech bubble contains ONLY ONE simple question-mark symbol (?) as a permitted pictogram, and no other marks or writing. Glass and bubble should be clearly separated, readable at 640px. Cheerful thoughtful expression. Teal is the main scene accent.
```

### act2-prompt.webp

```text
Use case: illustration-story. ONE isolated classroom website illustration, wide 3:2 aspect ratio. Input image 1 is the established mascot AND style reference, not an image to reproduce unchanged. Preserve exactly its cream fur, floppy peach-inside ears, three-tuft forelock, rounded brown eyes, tiny brown nose, peach cheeks, round paws, curled fluffy tail and plump baby proportions. Same warm storybook style: clean flat pastel shapes, delicate watercolor grain and consistent warm brown outlines. All scene objects fully visible, compact balanced composition with generous clear edge margin. Truly transparent background with alpha, no background fill, no vignette, no floor, no checkerboard artwork. Original unbranded characters; no existing franchise resemblance. no text, no letters, no numbers, no logos, no watermark. Scene: the mascot holds a big coral #E2525B pencil. To one side, a simple empty coral-outlined speech bubble transforms through two small sparkling marks into a finished small picture frame containing a simple colorful paw-print drawing and small sun. The visual sequence is speech bubble then framed image, with no words or arrows needed. One mascot only, friendly and pleased. Coral is the main accent; no question mark in this image.
```

### act3-handdraw.webp

```text
Use case: illustration-story. ONE isolated classroom website illustration, wide 3:2 aspect ratio. Input image 1 is the established mascot AND style reference, not an image to reproduce unchanged. Preserve exactly its cream fur, floppy peach-inside ears, three-tuft forelock, rounded brown eyes, tiny brown nose, peach cheeks, round paws, curled fluffy tail and plump baby proportions. Same warm storybook style: clean flat pastel shapes, delicate watercolor grain and consistent warm brown outlines. All scene objects fully visible, compact balanced composition with generous clear edge margin. Truly transparent background with alpha, no background fill, no vignette, no floor, no checkerboard artwork. Original unbranded characters; no existing franchise resemblance. no text, no letters, no numbers, no logos, no watermark. Scene: a single simplified child's hand enters from the upper left with the index finger clearly extended diagonally toward the center and the other fingers naturally curled. Neutral pale peach stylized hand, no ethnic detail. The mascot at the lower right playfully follows that fingertip, using a small paintbrush in its paw to paint a smooth vivid pastel rainbow swoosh curving behind it. Keep fingertip, mascot and painted trail clearly legible. A small simple webcam with an orange #D98806 body, dark circular lens and little stand sits at lower left. Orange is the main accent. No device screen, no extra hands, no disembodied fingertip, no letters or symbols.
```

### wrap-summary.webp

```text
Use case: illustration-story. ONE isolated classroom website illustration, wide 3:2 aspect ratio. Input image 1 is the established mascot AND style reference, not an image to reproduce unchanged. Preserve exactly its cream fur, floppy peach-inside ears, three-tuft forelock, rounded brown eyes, tiny brown nose, peach cheeks, round paws, curled fluffy tail and plump baby proportions. Same warm storybook style: clean flat pastel shapes, delicate watercolor grain and consistent warm brown outlines. All scene objects fully visible, compact balanced composition with generous clear edge margin. Truly transparent background with alpha, no background fill, no vignette, no floor, no checkerboard artwork. Original unbranded characters; no existing franchise resemblance. no text, no letters, no numbers, no logos, no watermark. Scene: the mascot is sitting on top of a large open notebook, with both pages entirely blank. It raises one front paw in a clear friendly thumbs-up gesture, using a simple rounded cartoon thumb while preserving the mascot's paw style. Three or four small blue and gold stars float around its head. Blue #4B6BD6 accents on notebook cover and stars. Happy completion mood. Notebook has no writing, no lines that look like text, no letters or numbers.
```

### stamp-1.webp

```text
Use case: illustration-story. ONE isolated square 1:1 rubber-stamp imprint asset for a warm pastel classroom website. A round double-ring stamp border surrounding one centered simple pictorial emblem. Flat monochrome stamped ink, organic subtly irregular edges, realistic fine distressed rubber ink grain and small missing-ink speckles throughout rings and symbol. Bold rounded forms, generous spacing, legible at 240px. This is the ink imprint ONLY, no stamp handle, no paper, no drop shadow. Match the friendly rounded storybook visual family of the mascot reference, but use only the specified ink hue and transparent negative space. Truly transparent background with alpha, including negative spaces and distressed holes, no white background rectangle, no checkerboard painted in. no text, no letters, no numbers, no logos, no watermark. Ink hue teal #0B8F78. Center symbol: one large tilted magnifying glass with a round lens and a rounded short handle. No mascot.
```

### stamp-2.webp

```text
Use case: illustration-story. ONE isolated square 1:1 rubber-stamp imprint asset for a warm pastel classroom website. A round double-ring stamp border surrounding one centered simple pictorial emblem. Flat monochrome stamped ink, organic subtly irregular edges, realistic fine distressed rubber ink grain and small missing-ink speckles throughout rings and symbol. Bold rounded forms, generous spacing, legible at 240px. This is the ink imprint ONLY, no stamp handle, no paper, no drop shadow. Match the friendly rounded storybook visual family of the mascot reference, but use only the specified ink hue and transparent negative space. Truly transparent background with alpha, including negative spaces and distressed holes, no white background rectangle, no checkerboard painted in. no text, no letters, no numbers, no logos, no watermark. Ink hue coral #E2525B. Center symbol: a rounded EMPTY speech bubble paired with a diagonal pencil, both clearly identifiable. No question mark, no mascot.
```

### stamp-3.webp

```text
Use case: illustration-story. ONE isolated square 1:1 rubber-stamp imprint asset for a warm pastel classroom website. A round double-ring stamp border surrounding one centered simple pictorial emblem. Flat monochrome stamped ink, organic subtly irregular edges, realistic fine distressed rubber ink grain and small missing-ink speckles throughout rings and symbol. Bold rounded forms, generous spacing, legible at 240px. This is the ink imprint ONLY, no stamp handle, no paper, no drop shadow. Match the friendly rounded storybook visual family of the mascot reference, but use only the specified ink hue and transparent negative space. Truly transparent background with alpha, including negative spaces and distressed holes, no white background rectangle, no checkerboard painted in. no text, no letters, no numbers, no logos, no watermark. Ink hue warm orange #D98806. Center symbol: a paintbrush paired with a cute animal pawprint showing one large pad and three little toe pads. No mascot.
```

### empty-canvas.webp

```text
Use case: illustration-story. ONE isolated square 1:1 empty-state classroom illustration. A simple rounded picture frame, empty except for a trail of small animal paw prints arranged into the curved silhouette of a question mark, including a single pawprint dot below. The paws form a pictogram, no actual printed question-mark glyph. Low-contrast pale gray palette, warm gray outlines, very light gray interior, subtle watercolor grain. Clean flat shapes, soft rounded storybook style matching reference. One frame only, no mascot, no stand, no external scene. Centered, front view, complete frame visible with generous transparent margin. Truly transparent alpha background outside frame, no paper rectangle behind frame, no checkerboard artwork. no text, no letters, no numbers, no logos, no watermark.
```

### pair-ab.webp

```text
Use case: illustration-story. ONE wide 2:1 isolated classroom website illustration, composed to stay legible at 320x160 pixels. Two simplified elementary-age children sit facing one another across a small low table. The child on the left speaks, with one simple empty rounded speech bubble above their head and one natural hand gesture. The child on the right listens and draws with a pencil on paper on the table, a simple sketch of the established cream pet mascot on the paper. Children have very simple neutral peach faces and hands, dot eyes, small smiles, no features identifying a specific ethnicity. Casual unbranded pastel coral and teal tops. Warm picture-book clean flat watercolor-touched style, rounded forms, consistent warm brown outlines, exactly matching style of mascot reference. Both children fully visible, anatomically simple, balanced composition and generous clear margins. Truly transparent background with alpha, no classroom walls, no floor, no background rectangle, no checkerboard artwork. no text, no letters, no numbers, no A or B labels, no logos, no watermark.
```

